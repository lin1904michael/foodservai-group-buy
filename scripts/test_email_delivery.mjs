import 'dotenv/config'

const EMAIL = 'no.99.group.llc@gmail.com'
const BASE = process.env.N8N_BASE_URL

console.log(`Requesting login challenge for ${EMAIL}…`)
const r = await fetch(`${BASE}/webhook/auth/login-challenge`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mode: 'request', target: EMAIL, channel: 'email', challenge_type: 'otp' }),
})
const text = await r.text()
let body
try { body = JSON.parse(text) } catch { body = text }
console.log(`HTTP ${r.status}:`, body)
console.log('\nIf ok, the delivery worker should send the email within ~60s.')
console.log('Check inbox of', EMAIL)
