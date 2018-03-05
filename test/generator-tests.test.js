const metadata = require('./metadata.json');
const generate = require('../index');
const fs = require('fs');

const importStatements = `import bla from './bla;`;

test('Analytics lib generator should generate the file correctly', () => {
  let expectedResult = fs.readFileSync(__dirname + `/expected-result.txt`, 'utf8');
  let output = generate(metadata, { importStatements: importStatements, footerFile: __dirname + '/append-to-end.js' });
  expect(output).toBe(expectedResult);
});