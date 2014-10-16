# API Blueprint JSON Schema

Validates payloads against a specified JSON Schema within your API Blueprint.

* Validate request bodies in your route handlers or middleware
* Validate response bodies within tests

## Installation

    npm install api-blueprint-json-schema --save

## Usage

    // Dependencies
    var BlueprintSchema = require( 'api-blueprint-json-schema' );

    // Create instance of BlueprintSchema
    var blueprintSchema = new BlueprintSchema( '# My API Blueprint …', {
      errorSchema: errorJsonSchema    // Response schema for 400+ status' (optional)
    } );

    // Access the blueprint JSON, for whatever reason
    var blueprint = blueprintSchema.blueprint;

    // Optionally set a response error schema later
    blueprintSchema.errorSchema = errorJsonSchema;

    router.get( '/my/resource/:resourceId', function( request, response, next ) {

      // Validate payload
      blueprintSchema.validate( request.body, {

        type: 'request',              // eg. 'request' or 'response'
        route: request.route.path,    // eg. '/my/resource/:resourceId'
        method: request.method,       // eg. 'GET'
        statusCode: '200'             // eg. '200' (only used if type = 'response')

      }, function( error, result ) {

        if ( error ) {
          console.log( error );
        }

        if ( result.errors ) {
          return response.status( 400 ).send( result );
        }

        return response.status( 200 ).send( {
          message: 'success!'
        } );

      } );

    } );

    // Get a schema, for whatever reason
    var someSchema = blueprintSchema.get( {
      type: 'request',
      route: '/my/route,
      method: 'GET',
      statusCode: '200'
    } );
