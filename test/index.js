// External dependencies
var fs = require( 'fs' );


// Dependencies
var BlueprintSchema = require( '../' ),
    blueprintMd = fs.readFileSync( __dirname + '/./blueprint.md' ).toString();


var defaultErrorSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Error",
  "type": "object",
  "required": [
    "code",
    "message",
    "errors"
  ],
  "properties": {
    "code": {
      "description": "Error code reference.",
      "type": "string"
    },
    "message": {
      "description": "Error description",
      "type": "string"
    },
    "errors": {
      "description": "Errors related to request data.",
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "message"
        ],
        "properties": {
          "property": {
            "description": "Property name.",
            "type": "string"
          },
          "message": {
            "description": "Error message relating to a property.",
            "type": "string"
          }
        }
      }
    }
  }
};

// Create instance of BlueprintSchema
var blueprintSchema = new BlueprintSchema( blueprintMd, {
  defaultErrorSchema: defaultErrorSchema
} );

var validRequestBody = {
  name: 'Lionel Rich-Tea',
  isDancingOnTheCeiling: true
};

var invalidRequestBody = {
  name: 'Lionel Rich-Tea',
  isDancingOnTheCeiling: 'Oh what a feeling!'
};

var yuk = setTimeout( function () {

  // Validate payload
  blueprintSchema.validate( invalidRequestBody, {

    type: 'request',
    route: '/test/:id',
    method: 'GET'

  }, function( error, result ) {

    if ( error ) {
      console.log( error );
    }

    if ( result.errors ) {
      console.log( 'validation errors' );
      console.log( JSON.stringify( result.errors, null, 2 ) );
      return;
    }

    console.log( 'validated!' );

  } );

  // Get schema
  blueprintSchema.get( {
    type: 'request',
    route: '/test/:id',
    method: 'GET',
    statusCode: '200'
  }, function ( error, schema ) {
    console.log( 'Got schema' );
    console.log( schema.title );
  } );

}, 1000 );
