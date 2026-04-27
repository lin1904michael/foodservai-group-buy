import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const tables = await client.query(`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  ORDER BY table_schema, table_name
`)
console.log('--- TABLES ---')
for (const r of tables.rows) console.log(`${r.table_schema}.${r.table_name}`)

console.log('\n--- COLUMNS (public schema) ---')
const cols = await client.query(`
  SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
`)
let current = ''
for (const r of cols.rows) {
  if (r.table_name !== current) { current = r.table_name; console.log(`\n[${current}]`) }
  console.log(`  ${r.column_name} :: ${r.data_type}${r.is_nullable === 'NO' ? ' NOT NULL' : ''}${r.column_default ? ` DEFAULT ${r.column_default}` : ''}`)
}

await client.end()
