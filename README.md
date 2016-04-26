# Bluth

A lightweight promise-based library to validate payloads against a specified JSON Schema within your API Blueprint.

### Why?

It encourages developers to utilise their API blueprint as a 'source of truth', creating synergy between documentation and source code. This ultimately improves quality and developer-experience for those using the API.

For example:

* Validate request bodies in your routing middleware
* Validate response bodies within tests

## Installation

```sh
npm install bluth --save
```

## Usage

###### Instantiation

```javascript
var Bluth = require( 'bluth' );


// A default error schema can be provided to catch any response status codes that aren't listed in the Blueprint
var bluth = new Bluth( myBlueprintMarkdown, {
  defaultErrorSchema: myDefaultErrorSchema
} );
```

###### Finding a schema

```javascript
bluth.find( {

  // 'request' or 'response'
  type: 'reponse',

  // URL path
  route: '/my/route',

  // HTTP method
  method: 'GET',

  // HTTP status code (required if type is 'response')
  statusCode: 200

} )
  .then( function( schema ) {
    // hooray!
  } );
```

###### Validating a payload

Uses `jsonschema`'s built in validation method.

```javascript
bluth.validate( myRequestData, {
  type: 'request',
  route: '/my/resource/:resourceId',
  method: 'GET'
} )
  .then( function() {
    // Success!
  } )
  .catch( function( error ) {
    // Error thrown from jsonschema, with validation errors listed
  } );
```

###### Retrieving the Blueprint object

```javascript
bluth.get()
  .then( function( blueprint ) {
    // hooray!
  } );
```

## Licence

```
Copyright 2016 ribot Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
