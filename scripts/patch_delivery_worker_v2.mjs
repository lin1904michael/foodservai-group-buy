import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'fs'

const WF_ID = 'Mp3kMd5Je7JVek2O'
const GMAIL_CRED_ID = 'hFwYnuLLweYWLXae'
const GMAIL_CRED_NAME = 'Gmail account'
const BASE = process.env.N8N_BASE_URL
const KEY = process.env.N8N_API_KEY

async function n8n(method, path, body) {
  const r = await fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await r.text()
  let data; try { data = JSON.parse(text) } catch { data = text }
  if (!r.ok) { console.error(`HTTP ${r.status}:`, data); process.exit(1) }
  return data
}

const current = await n8n('GET', `/workflows/${WF_ID}`)
mkdirSync('scripts/backups', { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
writeFileSync(`scripts/backups/${WF_ID}_${stamp}.json`, JSON.stringify(current, null, 2))
console.log(`Backup → scripts/backups/${WF_ID}_${stamp}.json`)

const oldPg = current.nodes.find(n => n.type === 'n8n-nodes-base.postgres')
const pgCreds = oldPg?.credentials || {}
if (!pgCreds.postgres) { console.error('No postgres creds'); process.exit(1) }

const pickSql = `WITH picked AS (
  SELECT outbound_message_id
  FROM auth_outbound_messages
  WHERE delivery_channel = 'email'
    AND (
      delivery_status = 'queued'
      OR (delivery_status = 'sending' AND last_attempt_at < NOW() - INTERVAL '5 minutes')
    )
    AND (last_attempt_at IS NULL OR last_attempt_at < NOW() - INTERVAL '30 seconds')
  ORDER BY created_at ASC
  LIMIT 50
  FOR UPDATE SKIP LOCKED
),
upd AS (
  UPDATE auth_outbound_messages m
  SET delivery_status = 'sending',
      attempt_count   = attempt_count + 1,
      last_attempt_at = NOW(),
      updated_at      = NOW()
  FROM picked p
  WHERE m.outbound_message_id = p.outbound_message_id
  RETURNING m.outbound_message_id, m.message_kind, m.delivery_target, m.payload_token
)
SELECT
  outbound_message_id,
  message_kind,
  delivery_target,
  payload_token,
  CASE message_kind
    WHEN 'login_challenge' THEN 'Your FoodservAI sign-in code'
    WHEN 'verification'    THEN 'Verify your FoodservAI account'
    ELSE 'FoodservAI notification'
  END AS subject,
  CASE message_kind
    WHEN 'login_challenge' THEN
      'Hi,' || E'\\n\\n' ||
      'Use this code to sign in to FoodservAI. It expires in 5 minutes.' || E'\\n\\n' ||
      payload_token || E'\\n\\n' ||
      'If you did not request this, you can ignore this email.' || E'\\n\\n' ||
      '— FoodservAI'
    WHEN 'verification' THEN
      'Hi,' || E'\\n\\n' ||
      'Use this code to verify your FoodservAI account:' || E'\\n\\n' ||
      payload_token || E'\\n\\n' ||
      '— FoodservAI'
    ELSE
      'FoodservAI: ' || payload_token
  END AS body
FROM upd;`

// Resolve outbound_message_id from upstream Pick node via pairedItem chain.
const resolveCode = `
const items = $input.all();
const out = [];
for (let i = 0; i < items.length; i++) {
  const it = items[i];
  let idx = i;
  const pi = it.pairedItem;
  if (pi != null) {
    if (typeof pi === 'number') idx = pi;
    else if (Array.isArray(pi) && pi.length) idx = pi[0].item ?? pi[0];
    else if (typeof pi === 'object' && pi.item != null) idx = pi.item;
  }
  const picked = $('Pick & lock email queue').all()[idx];
  const id = picked?.json?.outbound_message_id;
  if (id) out.push({ json: { outbound_message_id: id } });
}
return out;
`.trim()

const markDeliveredSql = `=UPDATE auth_outbound_messages
SET delivery_status='delivered', delivered_at=NOW(), updated_at=NOW()
WHERE outbound_message_id = '{{ $json.outbound_message_id }}'::uuid;`

const markFailedSql = `=UPDATE auth_outbound_messages
SET delivery_status='failed', updated_at=NOW()
WHERE outbound_message_id = '{{ $json.outbound_message_id }}'::uuid;`

const newNodes = [
  {
    parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 1 }] } },
    id: 'sched-trigger',
    name: 'Schedule Trigger',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [240, 300],
  },
  {
    parameters: { operation: 'executeQuery', query: pickSql, options: {} },
    id: 'pg-pick',
    name: 'Pick & lock email queue',
    type: 'n8n-nodes-base.postgres',
    typeVersion: 2.5,
    position: [480, 300],
    credentials: pgCreds,
  },
  {
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: '={{ $json.delivery_target }}',
      subject: '={{ $json.subject }}',
      emailType: 'text',
      message: '={{ $json.body }}',
      options: {},
    },
    id: 'gmail-send',
    name: 'Send via Gmail',
    type: 'n8n-nodes-base.gmail',
    typeVersion: 2.1,
    position: [720, 300],
    credentials: { gmailOAuth2: { id: GMAIL_CRED_ID, name: GMAIL_CRED_NAME } },
    onError: 'continueErrorOutput',
  },
  {
    parameters: { jsCode: resolveCode },
    id: 'resolve-success',
    name: 'Resolve id (success)',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [940, 220],
  },
  {
    parameters: { jsCode: resolveCode },
    id: 'resolve-failure',
    name: 'Resolve id (failure)',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [940, 380],
  },
  {
    parameters: { operation: 'executeQuery', query: markDeliveredSql, options: {} },
    id: 'pg-mark-delivered',
    name: 'Mark delivered',
    type: 'n8n-nodes-base.postgres',
    typeVersion: 2.5,
    position: [1160, 220],
    credentials: pgCreds,
  },
  {
    parameters: { operation: 'executeQuery', query: markFailedSql, options: {} },
    id: 'pg-mark-failed',
    name: 'Mark failed',
    type: 'n8n-nodes-base.postgres',
    typeVersion: 2.5,
    position: [1160, 380],
    credentials: pgCreds,
  },
]

const newConnections = {
  'Schedule Trigger': { main: [[{ node: 'Pick & lock email queue', type: 'main', index: 0 }]] },
  'Pick & lock email queue': { main: [[{ node: 'Send via Gmail', type: 'main', index: 0 }]] },
  'Send via Gmail': {
    main: [[{ node: 'Resolve id (success)', type: 'main', index: 0 }]],
    error: [[{ node: 'Resolve id (failure)', type: 'main', index: 0 }]],
  },
  'Resolve id (success)': { main: [[{ node: 'Mark delivered', type: 'main', index: 0 }]] },
  'Resolve id (failure)': { main: [[{ node: 'Mark failed', type: 'main', index: 0 }]] },
}

const updated = await n8n('PUT', `/workflows/${WF_ID}`, {
  name: current.name, nodes: newNodes, connections: newConnections, settings: current.settings || {},
})
console.log('\nUpdated:', updated.name)
console.log('Active:', updated.active)
console.log('Nodes:', updated.nodes.map(n => n.name).join(' → '))
