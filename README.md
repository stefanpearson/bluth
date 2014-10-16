# API Blueprint JSON Schema

Validates payloads against a specified JSON Schema within your API Blueprint.

    npm install api-blueprint-json-schema --save

## Usage

    // Dependencies
    var BlueprintSchema = require( 'api-blueprint-json-schema' );

    // Create instance of BlueprintSchema
    var blueprintSchema = new BlueprintSchema( '# My API Blueprint' );

    // Some route handler
    router.get( '/my/resource/:resourceId', function ( request, response, next ) {
      var payload = request.body;

      // Validate payload
      blueprintSchema.validate( payload, {
         type: 'request',
         name: 'A', // optional
         route: '/my/resource/:resourceId',
         method: 'GET'
      }, function ( error, result ) {

        if ( result.errors ) {
          return response.status( 400 ).send( result );
        }

        return response.status( 200 ).send( {
          message: 'success!'
        } );

      } );

    } );
