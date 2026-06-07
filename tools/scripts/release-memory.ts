/**
 * Release script for @swohn/memory (@swohn/memory)
 *
 * Usage: tsx tools/scripts/release-memory.ts [patch|minor|major]
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';
import { bumpVersion, confirmRelease } from './release-utils';

const ROOT_DIR = path.resolve(__dirname, '../..');
const MEMORY_DIR = path.join(ROOT_DIR, 'packages/memory');
const PACKAGE_JSON_PATH = path.join(MEMORY_DIR, 'package.json');

async function main() {
  const bump = (process.argv[2] || 'patch') as 'patch' | 'minor' | 'major';

  const pkg = await fs.readJson(PACKAGE_JSON_PATH);
  const oldVersion = pkg.version;
  const newVersion = bumpVersion(oldVersion, bump);

  console.log(`\n📦 @swohn/memory: ${oldVersion} → ${newVersion} (${bump})\n`);

  if (!(await confirmRelease(newVersion))) {
    console.log('Cancelled.');
    return;
  }

  // Update version
  pkg.version = newVersion;
  await fs.writeJson(PACKAGE_JSON_PATH, pkg, { spaces: 2 });

  // Build
  console.log('🔨 Building...');
  execSync('pnpm --filter @swohn/memory build', { cwd: ROOT_DIR, stdio: 'inherit' });

  // Publish
  console.log('🚀 Publishing...');
  execSync('npm publish --access public', { cwd: MEMORY_DIR, stdio: 'inherit' });

  console.log(`\n✅ @swohn/memory@${newVersion} published successfully!`);
}

main().catch((err) => {
  console.error('❌ Release failed:', err.message);
  process.exit(1);
});
