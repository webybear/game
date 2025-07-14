const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  try {
    const srcDir = path.resolve(__dirname, '../src/app');
    const destDir = path.resolve(__dirname, '../dist/app');
    
    // Ensure the destination directory exists
    await fs.ensureDir(destDir);
    
    // Copy the schema.graphql file
    await fs.copyFile(
      path.join(srcDir, 'schema.graphql'),
      path.join(destDir, 'schema.graphql')
    );
    
    console.log('Successfully copied GraphQL schema.');
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
}

copyAssets(); 