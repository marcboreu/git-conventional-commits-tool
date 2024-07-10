import fs from 'fs';
import path from 'path';

const projectPackageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(projectPackageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(projectPackageJsonPath, 'utf-8'));

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts.gttc = 'gttc';

  fs.writeFileSync(
    projectPackageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
  console.log('Script "gttc" added to package.json');
} else {
  console.error('Could not find package.json in the project root.');
}
