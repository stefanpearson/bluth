# API Blueprint JSON Schema

Validates payloads against a specified JSON Schema within your API Blueprint.

* Validate request bodies in your route handlers or middleware
* Validate response bodies within tests

    npm install api-blueprint-json-schema --save

## Usage

    // Dependencies
    var BlueprintSchema = require( 'api-blueprint-json-schema' );

    // Create instance of BlueprintSchema
    var blueprintSchema = new BlueprintSchema( '# My API Blueprint …' );

    // Some route handler
    router.get( '/my/resource/:resourceId', function( request, response, next ) {

      // Validate payload
      blueprintSchema.validate( request.body, {

        type: 'request',              // eg. 'request' or 'response'
        route: request.route.path,    // eg. '/my/resource/:resourceId'
        method: request.method,       // eg. 'GET'
        name: 'A'                     // eg. 'A', '200', '401' (optional)

      }, function( error, result ) {

        if ( result.errors ) {
          return response.status( 400 ).send( result );
        }

        return response.status( 200 ).send( {
          message: 'success!'
        } );

      } );

    } );
