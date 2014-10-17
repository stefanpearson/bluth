// External dependencies
var fs = require( 'fs' ),
    should = require( 'should' );


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
          "property",
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


describe( 'Instantiation', function() {

  it( 'should create an instance of BlueprintSchema', function( done ) {

    BlueprintSchema.create( blueprintMd, {}, function( error, blueprintSchema ) {
      done();
    } );

  } );

  it( 'should return an error if Blueprint could not be parsed', function( done ) {

    BlueprintSchema.create( {}, {}, function( error, blueprintSchema ) {

      should.exist( error );

      done();

    } );

  } );

  it( 'should log any API Blueprint warnings' );

  it( 'should have config properties set on the instance', function( done ) {

    BlueprintSchema.create( blueprintMd, {
      someProperty: 'hello'
    }, function( error, blueprintSchema ) {

      should.not.exist( error );
      blueprintSchema.should.have.property( 'someProperty' );

      done();

    } );

  } );

} );


describe( 'Schema selection', function() {
  var testBlueprintSchema;

  before( function ( done ) {

    BlueprintSchema.create( blueprintMd, {
      defaultErrorSchema: defaultErrorSchema
    }, function( error, blueprintSchema ) {

      testBlueprintSchema = blueprintSchema;

      done();

    } );

  } );

  it( 'should return a request schema', function( done ) {
    var options = {
      type: 'request',
      route: '/test/:id',
      method: 'GET'
    };

    testBlueprintSchema.get( options, function ( error, schema ) {

      should.not.exist( error );
      schema.should.be.type( 'object' );
      schema.title.should.containEql( options.method.replace( /\{([\w-_]+)\}/, ':$1' ) );

      done();

    } );

  } );

  it( 'should error if the request schema wasn\'t found', function( done ) {
    var options = {
      type: 'request',
      route: '/invalid-route/:id',
      method: 'GET'
    };

    testBlueprintSchema.get( options, function ( error, schema ) {

      should.exist( error );

      done();

    } );

  } );

  it( 'should error if options are invalid', function( done ) {
    var options = {
      route: '/test/:id',
    };

    testBlueprintSchema.get( options, function( error, schema ) {

      should.exist( error );

      done();

    } );

  } );

  it( 'should return a response schema', function( done ) {
    var options = {
      type: 'response',
      route: '/test/:id',
      method: 'GET',
      statusCode: 200
    };

    testBlueprintSchema.get( options, function( error, schema ) {

      should.not.exist( error );
      schema.should.be.type( 'object' );
      schema.title.should.containEql( options.method.replace( /\{([\w-_]+)\}/, ':$1' ) );
      schema.title.should.containEql( options.statusCode );

      done();

    } );

  } );

  it( 'should return a response error schema', function( done ) {
    var options = {
      type: 'response',
      route: '/test/:id',
      method: 'GET',
      statusCode: 500
    };

    testBlueprintSchema.get( options, function( error, schema ) {

      should.not.exist( error );
      schema.should.be.type( 'object' );
      schema.title.should.containEql( options.method.replace( /\{([\w-_]+)\}/, ':$1' ) );
      schema.title.should.containEql( options.statusCode );

      done();

    } );

  } );

  it( 'should return a default response error schema if one is not present', function( done ) {
    var options = {
      type: 'response',
      route: '/test/:id',
      method: 'GET',
      statusCode: 400
    };

    testBlueprintSchema.get( options, function( error, schema ) {

      should.not.exist( error );
      schema.should.be.type( 'object' );
      schema.title.should.equal( defaultErrorSchema.title );

      done();

    } );

  } );

} );


describe( 'Validation', function() {
  var testBlueprintSchema;

  before( function ( done ) {

    BlueprintSchema.create( blueprintMd, {}, function( error, blueprintSchema ) {

      testBlueprintSchema = blueprintSchema;

      done();

    } );

  } );

  it( 'should pass validation when valid data is provided', function( done ) {
    var data = {
      name: 'Lionel Rich-Tea',
      isDancingOnTheCeiling: true
    };

    testBlueprintSchema.validate( data, {
      type: 'request',
      route: '/test/:id',
      method: 'GET'
    }, function( error, results ) {

      should.not.exist( error );
      results.errors.should.be.empty;

      done();

    } );

  } );

  it( 'should return a list of errors when invalid data is provided', function( done ) {
    var data = {
      isDancingOnTheCeiling: true
    };

    testBlueprintSchema.validate( data, {
      type: 'request',
      route: '/test/:id',
      method: 'GET'
    }, function( error, results ) {

      should.not.exist( error );
      results.errors.should.not.be.empty;

      done();

    } );

  } );

} );
