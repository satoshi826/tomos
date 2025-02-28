const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)

const dbName = 'tomos-db'

if (args.length < 1) {
  console.error('Usage: node migrate.js <command> [options]')
  process.exit(1)
}

const command = args[0]
const options = args.slice(1).join(' ')

switch (command) {
  case 'generate':
    {
      const migrationName = options || 'new_migration'
      execSync(`npx wrangler d1 migrations create ${dbName} ${migrationName}`, {
        stdio: 'inherit',
      })

      const migrationsDir = './migrations'
      const files = fs.readdirSync(migrationsDir)
      const latestMigration = files
        .filter((f) => f.endsWith('.sql'))
        .sort()
        .pop()

      if (!latestMigration) {
        console.error('No migration files found')
        process.exit(1)
      }

      const migrationPath = path.join(migrationsDir, latestMigration)
      execSync(`npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output ${migrationPath}`, {
        stdio: 'inherit',
      })
      console.log(`\nMigration generated: ${migrationPath}`)
    }
    break
  case 'apply:local':
    execSync(`npx wrangler d1 migrations apply ${dbName} --local`, {
      stdio: 'inherit',
    })
    break
  case 'apply:remote':
    execSync(`npx wrangler d1 migrations apply ${dbName} --remote`, {
      stdio: 'inherit',
    })
    break
  default:
    console.error('Unknown command:', command)
    process.exit(1)
}
