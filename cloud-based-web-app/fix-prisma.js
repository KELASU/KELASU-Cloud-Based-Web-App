const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('SETTING UP NEON SERVERLESS ADAPTER (The Modern Way)...');

const run = (cmd) => {
  try {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (e) {
    console.error(`ERROR running command: ${cmd}`);
  }
};

console.log('Installing Neon Adapter dependencies...');
run('npm install @prisma/adapter-neon @neondatabase/serverless ws');
run('npm install -D @types/ws');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  console.log('Configuring prisma/schema.prisma for Driver Adapters...');
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  let modified = false;

  if (!schemaContent.includes('"driverAdapters"')) {
    console.log('  -> Enabling "driverAdapters" preview feature...');
    if (schemaContent.includes('previewFeatures = [')) {
      schemaContent = schemaContent.replace(
        'previewFeatures = [',
        'previewFeatures = ["driverAdapters", '
      );
    } else {
      schemaContent = schemaContent.replace(
        'provider = "prisma-client-js"',
        'provider = "prisma-client-js"\n  previewFeatures = ["driverAdapters"]'
      );
    }
    modified = true;
  }

  if (schemaContent.includes('engineType = "library"')) {
    console.log('  -> Removing explicit engineType="library" (Adapter needs default/client)...');
    schemaContent = schemaContent.replace(/engineType\s*=\s*"library"/g, '// engineType = "library"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('  -> schema.prisma UPDATED.');
  } else {
    console.log('  -> schema.prisma is already configured for Adapters.');
  }
}

console.log('Regenerating Prisma Client...');
run('npx prisma generate');

console.log('\n================================================');
console.log('SUCCESS! Environment setup for Neon Adapter.');
console.log('IMPORTANT: You MUST now update src/lib/prisma.ts to use the adapter.');
console.log('See the provided code snippet in the chat.');
console.log('Then: npm run dev');
console.log('================================================');