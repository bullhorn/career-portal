// Vendor
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const JenkinsBuildNumber = process.argv['GITHUB_RUN_NUMBER'] || 'UNKNOWN';
const CommitHash = process.argv['GITHUB_SHA'] || 'UNKNOWN';
const now = new Date();

let data = `
_________                                           __________                   __           .__
\\_   ___ \\ _____   _______   ____    ____  _______  \\______   \\  ____  _______ _/  |_ _____   |  |
/    \\  \\/ \\__  \\  \\_  __ \\_/ __ \\ _/ __ \\ \\_  __ \\  |     ___/ /  _ \\ \\_  __ \\   __\\__  \\  |  |
\\     \\____ / __ \\_ |  | \\/\\  ___/ \\  ___/  |  | \\/  |    |    (  <_> ) |  | \\/ |  |   / __ \\_|  |__
 \\______  /(____  / |__|    \\___  > \\___  > |__|     |____|     \\____/  |__|    |__|  (____  /|____/
        \\/      \\/              \\/      \\/                                                 \\/

Date: ${now.toUTCString()}
Career Portal Version: ${require('./package.json').version}
Build Information:
  Build#: ${JenkinsBuildNumber}
  Commit: ${CommitHash}
Dependency Information:
  NovoElements: ${require('./node_modules/novo-elements/package.json').version}
`;

console.log('Writing Version.txt');
console.log(data);

fs.writeFile(path.resolve('src', 'version.txt'), data, err => {
  if (err) {
    console.error('Failed to write version:', err.message);
  } else {
    console.log(chalk.blue('Version file written!'));
  }
});
