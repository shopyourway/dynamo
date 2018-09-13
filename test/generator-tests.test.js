const metadata = require('./metadata.json');
const generate = require('../index');
const fs = require('fs');

const importStatementsJs = `import bla from './bla;`;
const importStatementsCsharp = `using System.Collections.Generic;

namespace Ohio.Analytics
{
	public static class UserAnalytics
	{`;

test('Analytics lib generator should generate the js file correctly', () => {
  let expectedResult = fs.readFileSync(__dirname + `/expected-result-js.txt`, 'utf8');
  let output = generate(metadata, { importStatements: importStatementsJs, footerFile: __dirname + '/append-to-end.js', language: 'js' });
  expect(output).toBe(expectedResult);
});

test('Analytics lib generator should generate the c# file correctly', () => {
    let expectedResult = fs.readFileSync(__dirname + `/expected-result-csharp.txt`, 'utf8');
    let output = generate(metadata, { importStatements: importStatementsCsharp, language: 'csharp' });
    expect(output).toBe(expectedResult);
});