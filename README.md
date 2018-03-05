# Dynamo
Dynamo generates an analytics javascript API based on a json file definition.

When you report "simple pixels" to GA / MixPanel / Omniture you must implement in your analytics tracker layer all the dimensions and metrics index.
For example:
```js
ga('send', 'event', 'Catalogs', 'Add', {
'dimension1': 'Product',
'metric1': 1});
``` 
Working that way is hard to keep your analytics aligned between all platforms and feature in your organization.
Currently Dynamo support generation a JS API from an input json file. In the future it will also supports other languges.
 
Using this json file you will be able to have 1 business language for your business analytics.
You can create this json file through your CMS system for example and give the ability for PM / data analyst to define the analytics that your product needs to report.
Dynamo uses a middle layer called tagManagerReporter that you can later on map to your dimensions and metrics and report to the analytics vendor / tag manager you work with.  

## Highlights
* JSON to js
* Tag manager support
* Business language over technical language
* 1 language for your business analytics across all features / platforms

## Getting started
### Installation
[![npm (scoped)](https://img.shields.io/npm/v/@shopyourway/dynamo.svg)](https://www.npmjs.com/package/@shopyourway/dynamo)

### Configuration
Import dynamo package:
```js
﻿const generate = require('@shopyourway/dynamo');
```

### Generator Usage
Use the `generator` instance to generate the js analytics API
```js
const fs = require('fs');

const metadata = JSON.parse(fs.readFileSync('PATH_TO_JSON_FILE'));
const output = generate(metadata, { footerFile: footerFile, importStatements: importStatements });
fs.writeFile('PATH_TO_JS_OUTPUT_API', output);
```

### Example

Suppose you have the following JSON file:
```json
{
  "eventDefinitions": {
    "actionsList": [
      "Add To Catalog"
    ]
  },
  "definitions": {
    "addToCatalog": {
      "parameters": {
        "entityType": "string"
      },
      "dimensions": {
        "eventAction": "Add To Catalog",
        "entityType": "{{entityType}}"
      },
      "metrics": [ "engagementMetric", "addToCatalogMetric" ],
      "eventType": "event"
    }
  }
}
```
The output will be:
```javascript
import bla from './bla';

export var actions = {
  "like": "Like",
  "goToDownloadApp": "Go To Download App"
  };
var actionsValues = {
  "Like": 1,
  "Go To Download App": 1
  };

export function addToCatalog(entityType) {
  const eventData = {};

  eventData.eventAction = `Add To Catalog`;
  eventData.entityType = `${entityType}`;
  eventData.engagementMetric = `1`;
  eventData.addToCatalogMetric = `1`;
  tagManagerReporter.link(eventData);
}
```
With the new file you can
```js
myGeneratedAnalytics.addToCatalog('Product');
```
## Development

### How to contribute
We encorage contribution via pull requests on any feature you see fit.

When submitting a pull request make sure to do the following:
* Check that new and updated code follows OhioBox existing code formatting and naming standard
* Run all unit and integration tests to ensure no existing functionality has been affected
* Write unit or integration tests to test your changes. All features and fixed bugs must have tests to verify they work
Read [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more details about creating pull requests

### Running tests
To run tests, in command line simply run `npm test`