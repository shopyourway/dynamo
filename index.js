const fs = require('fs');
const camelCase = require('camel-case');

module.exports = function(metadata, settings) {
  let importStatements = settings.importStatements ? settings.importStatements : '';
  let footerFileContent = settings.footerFile ? fs.readFileSync(`${settings.footerFile}`, 'utf8') : '';
  return `${importStatements}

${setDeclarations('actions', metadata.eventDefinitions.actionsList)}

${setFunctions(metadata)};

${footerFileContent}`;
};

function setDeclarations(listName, list) {
  return `export var ${listName} = {
  ${list.map(element => `"${camelCase(element)}": "${element}"`).join(',\n  ')}
  };\nvar ${listName}Values = {
  ${list.map(element => `"${element}": 1`).join(',\n  ')}
  };`;
}

function setFunctions(metadata) {
  return Object.keys(metadata.definitions).map(key => createFunction(key, metadata.definitions[key])).join('\n')
}

function createFunction(functionName, functionMetadata) {
  const { eventType } = functionMetadata;
  const eventTypeFunctionName = (eventType === 'event' ? 'link' : 'track');

  return `export function ${functionName}(${formatParameters(functionMetadata.parameters).join(', ')}) {
  const eventData = {};

  ${setDimensions(functionMetadata)}
  ${setMetrics(functionMetadata)}
  tagManagerReporter.${eventTypeFunctionName}(eventData);
}`;
}

function formatParameters(parameters) {
  return Object.keys(parameters || {});
}

function setDimensions(functionMetadata) {
  const { dimensions } = functionMetadata;
  const { metrics } = functionMetadata;
  const separator = typeof(metrics) != 'object' ? '\n' : '';

  if (typeof dimensions == 'object')
    return Object.keys(dimensions).map(key => `eventData.${key} = ${formatAssignment(dimensions[key])};`).join('\n  ') + separator;

  return separator;
}

function setMetrics(functionMetadata) {
  const { metrics } = functionMetadata;

  if (typeof metrics == 'object')
    return metrics.map(key => `eventData.${key} = \`1\`;`).join('\n  ');

  return '';
}

function formatAssignment(value) {
  if(Array.isArray(value)) {
    return `[ ${value.map(formatAssignmentValue).join(', ')} ]`;
  }
  return formatAssignmentValue(value);
}

function formatAssignmentValue(value) {
  return '`' + value.replace(/{{/g, '${').replace(/}}/g, '}') + '`';
}