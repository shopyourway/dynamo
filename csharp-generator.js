const pascalCase = require('pascal-case');

module.exports = function(importStatements, footerFileContent, metadata) {
    return `${importStatements}
  ${setChsarpFunctions(metadata)}
  ${footerFileContent}`;
};

function setChsarpFunctions(metadata) {
    return Object.keys(metadata.definitions).map(key => createCsharpFunction(key, metadata.definitions[key])).join('\n')
}

function createCsharpFunction(functionName, functionMetadata) {
    const { eventType } = functionMetadata;
    if (eventType === 'pageview')
        return '';

    return `\t\tpublic Dictionary<string, string> ${pascalCase(functionName)}(${formatCsharpParameters(functionMetadata.parameters).join(', ')}) 
        {
            return new Dictionary<string, string> 
            {
                ${setCsharpDimensions(functionMetadata)}
            };
        }`;
}

function formatCsharpParameters(parameters) {
    return Object.keys(parameters || {}).map(x=> `string ${x}`);
}

function setCsharpDimensions(functionMetadata) {
    const { dimensions } = functionMetadata;
    const { metrics } = functionMetadata;

    return Object.keys(dimensions).concat(metrics).map(key => `{"${key}", "${formatCsharpAssignment(dimensions, key)}"}`).join(',\n\t\t\t\t');
}

function formatCsharpAssignment(dimensions, key) {
    if (typeof (dimensions[key]) === 'undefined')
        return '1';

    var value =  dimensions[key];
    if(Array.isArray(value)) {
        return `[ ${value.map(formatCsharpAssignmentValue).join(', ')} ]`;
    }
    return formatCsharpAssignmentValue(value);
}

function formatCsharpAssignmentValue(value) {
    if (value.startsWith('{{'))
        return value.replace(/{{/g, '').replace(/}}/g, '');

    return value;
}