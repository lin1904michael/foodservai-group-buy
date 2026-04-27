import 'dotenv/config'
import pg from 'pg'

const ids = process.argv.slice(2)
if (!ids.length) {
  console.error('Usage: node scripts/probe_workflow.mjs <workflowId> [<workflowId> ...]')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

for (const id of ids) {
  const r = await client.query(`SELECT id, name, nodes, connections, "active" FROM workflow_entity WHERE id = $1`, [id])
  if (!r.rows.length) { console.log(`-- ${id}: not found`); continue }
  const w = r.rows[0]
  console.log(`\n========== ${w.name} (${w.id}) active=${w.active} ==========`)
  for (const n of w.nodes) {
    const params = JSON.stringify(n.parameters || {}, null, 2).split('\n').map(l => '    ' + l).join('\n')
    console.log(`\n  NODE: ${n.name}  type=${n.type}  ver=${n.typeVersion}`)
    console.log(params)
  }
}

await client.end()
