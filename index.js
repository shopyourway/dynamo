const fs = require('fs');
const jsGenerator = require('./javascript-generator');
const csharpGenerator = require('./csharp-generator');

module.exports = function(metadata, settings) {
    let importStatements = settings.importStatements ? settings.importStatements : '';
    let footerFileContent = settings.footerFile ? fs.readFileSync(`${settings.footerFile}`, 'utf8') : '';
    let generatedResult;
    if (settings.language === 'js')
        generatedResult = jsGenerator(importStatements, footerFileContent, metadata);
    else
        generatedResult = csharpGenerator(importStatements, footerFileContent, metadata);

    return generatedResult.replace(/\r?\n/g, '\r\n');
}