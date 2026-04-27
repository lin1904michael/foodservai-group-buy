import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const r = await client.query(`
  SELECT id, name, type, "createdAt"
  FROM credentials_entity
  WHERE type ILIKE '%gmail%' OR type ILIKE '%smtp%' OR type ILIKE '%email%' OR type ILIKE '%mail%'
  ORDER BY "createdAt" DESC
`)
console.log('Email-related credentials:')
for (const c of r.rows) console.log(`  ${c.id}  ${c.type.padEnd(28)} ${c.name}`)

const all = await client.query(`SELECT type, COUNT(*) FROM credentials_entity GROUP BY type ORDER BY type`)
console.log('\nAll credential types:')
for (const c of all.rows) console.log(`  ${c.count}\t${c.type}`)

await client.end()
