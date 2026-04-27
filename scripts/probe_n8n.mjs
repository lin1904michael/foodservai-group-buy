import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

console.log('=== n8n DATA TABLES ===')
const dts = await client.query(`SELECT id, name, "projectId", "createdAt" FROM data_table ORDER BY "createdAt"`)
for (const t of dts.rows) {
  console.log(`\n[${t.name}] id=${t.id} project=${t.projectId}`)
  const cols = await client.query(`SELECT name, type, index FROM data_table_column WHERE "dataTableId" = $1 ORDER BY index`, [t.id])
  for (const c of cols.rows) console.log(`  ${c.index}. ${c.name} :: ${c.type}`)
}

console.log('\n\n=== n8n WORKFLOWS ===')
const wfs = await client.query(`SELECT id, name, active, "createdAt", "updatedAt" FROM workflow_entity ORDER BY "updatedAt" DESC`)
for (const w of wfs.rows) {
  console.log(`${w.active ? 'ON ' : 'off'}  ${w.id}  ${w.name}`)
}

console.log('\n\n=== WEBHOOKS ===')
const whs = await client.query(`SELECT "webhookPath", method, "workflowId", "pathLength" FROM webhook_entity ORDER BY "webhookPath"`)
for (const w of whs.rows) {
  console.log(`${w.method.padEnd(6)} /${w.webhookPath}  -> workflow ${w.workflowId}`)
}

await client.end()
