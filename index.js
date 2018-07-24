const fs = require('fs');
const jsGenerator = require('./javascript-generator');
const csharpGenerator = require('./csharp-generator');

module.exports = function(metadata, settings) {
    let importStatements = settings.importStatements ? settings.importStatements : '';
    let footerFileContent = settings.footerFile ? fs.readFileSync(`${settings.footerFile}`, 'utf8') : '';
    if (settings.language === 'js')
        return jsGenerator(importStatements, footerFileContent, metadata);

    return csharpGenerator(importStatements, footerFileContent, metadata);
}