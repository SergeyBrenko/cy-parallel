const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const glob = require('glob-promise');
const shell = require('shelljs');
const { Console } = require('console');
require('dotenv').config()

async function getIntegrationDirectory() {
  let integrationFolder = 'cypress/integration';
  let cypressJson = path.join(process.cwd(), 'cypress.json');
  try {
    await fs.promises.access(cypressJson, fs.constants.F_OK);
    let cypressConfig = require(cypressJson);
    integrationFolder = cypressConfig.integrationFolder ?? integrationFolder;
  }
  catch (err) {
    // Ignore if file does not exist
  }
  return integrationFolder;
}

async function main() {
  const currentNode = parseInt(process.env.CURRENT_NODE ?? 1, 10);
  const totalNodes = parseInt(process.env.CI_NODE_TOTAL ?? 1, 10);
  console.log('totalNodes', totalNodes);
  const integrationFolder = await getIntegrationDirectory();
  console.log('int folder', integrationFolder);
  const specs = await glob(integrationFolder + '/**/*.js');
  console.log('spec length', specs.length);
  const start = (currentNode - 1) * specs.length / totalNodes | 0;
  const end = (currentNode) * specs.length / totalNodes | 0;
  const specsToRun = specs.slice(start, end);
  const args = process.argv.slice(2).concat(['--spec', specsToRun.join(',')]);
  console.log(args);
  // let array = [];

  // [...new Array(totalNodes)].forEach((_, index) => {
  //   const start = (index + 1 - 1) * specs.length / totalNodes | 0;
  //   const end = (index + 1) * specs.length / totalNodes | 0;
  //   const specsToRun = specs.slice(start, end);
  //   const args = process.argv.slice(2).concat(['--spec', specsToRun.join(',')]);
  //   console.log(args);
  //   let prefix = `Parallel Cypress: Worker ${index + 1} of ${totalNodes}`;
  //   console.log(prefix);
  //   if (!specsToRun.length) {
  //     console.log(`${prefix}, no specs to run, ${specs.length} total`);
  //     return;
  //   }
  //   const readyScript = `npx cypress run ${args[0]} ${args[1]}`;
  //   console.log(readyScript);
  //   array.push(readyScript)
  // })
  // console.log(array.join(','))
  // shell.exec(`concurrently ${array.join(',')}`);

  


  // let specsToRun = specs.slice(start, end);
  // console.log(specsToRun);
  // let prefix = `Parallel Cypress: Worker ${nodeIndex} of ${totalNodes}`;
  // console.log(prefix);
  // if (!specsToRun.length) {
  //   console.log(`${prefix}, no specs to run, ${specs.length} total`);
  //   return;
  // }
  // console.log(`${prefix}, running specs ${start + 1} to ${end} of ${specs.length} total`);
  // let args = process.argv.slice(2)
  //   .concat(['--spec', specsToRun.join(',')]);
  // console.log('arg', args);
  let child = childProcess.spawn('npx cypress run', args, { stdio: 'inherit', shell: true });
  // console.log(child);
  await new Promise((resolve, reject) => {
    child.on('exit', exitCode => {
      if (exitCode) {
        reject(new Error(`Child process exited with code ${exitCode}`));
      }
      resolve();
    });
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});