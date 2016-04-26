# Bluth

A lightweight promise-based library to validate payloads against a specified JSON Schema within your API Blueprint.

### Why?

* Validate request bodies in your route handlers or middleware
* Validate response bodies within tests

## Installation

```sh
npm install bluth --save
```

## Usage

```javascript

// Dependencies
var Bluth = require( 'bluth' );


// Instantiate
// A default error schema can be provided to catch any response status codes that aren't listed in the Blueprint
var bluth = new Bluth( myBlueprintMarkdown, {
  defaultErrorSchema: myDefaultErrorSchema
} );


// Access the blueprint object, for whatever reason
bluth.get()
  .then( function( blueprint ) {
    // hooray!
  } );


// Find a schema within your Blueprint
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


// Validate a payload (uses jsonschema's built in validation method)
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
