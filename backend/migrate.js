const { execSync } = require('child_process')
const args = process.argv.slice(2)

if (args.length < 1) {
  console.error('Usage: node migrate.js <command> [options]')
  process.exit(1)
}

const command = args[0]
const options = args.slice(1).join(' ')

switch (command) {
  case 'create':
    execSync(`npx wrangler d1 migrations create ${options}`, {
      stdio: 'inherit',
    })
    break
  case 'diff':
    execSync(`npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output ${options}`, { stdio: 'inherit' })
    break
  case 'apply:local':
    execSync(`npx wrangler d1 migrations apply ${options} --local`, {
      stdio: 'inherit',
    })
    break
  case 'apply:remote':
    execSync(`npx wrangler d1 migrations apply ${options} --remote`, {
      stdio: 'inherit',
    })
    break
  default:
    console.error('Unknown command:', command)
    process.exit(1)
}
