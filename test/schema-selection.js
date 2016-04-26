// External dependencies
var fs = require( 'fs' ),
    should = require( 'should' );


// Dependencies
var Bluth = require( '../' ),
    defaultErrorSchema = require( './fixtures/default-error-schema' );


var blueprintMd = fs.readFileSync( __dirname + '/./fixtures/blueprint.md' ).toString();


describe( 'Schema selection', function() {

  before( function () {

    this.bluth = new Bluth( blueprintMd, {
      defaultErrorSchema: defaultErrorSchema
    } );

  } );

  it( 'should return a request schema', function( done ) {
    var params = {
      route: '/test/:id/something',
      method: 'POST',
      type: 'request'
    };

    this.bluth.find( params )
      .then( function( schema ) {

        schema.should.be.type( 'object' );
        schema.title.should.containEql( params.method.replace( /\{([\w-_]+)\}/, ':$1' ) );

        done();

      } );

  } );

  it( 'should error if the request schema wasn\'t found', function( done ) {
    var params = {
      route: '/invalid-route/:id',
      method: 'POST',
      type: 'request'
    };

    this.bluth.find( params )
      .catch( function( error ) {
        done();
      } );

  } );

  it( 'should error if parameters are invalid', function( done ) {
    var params = {
      route: '/test/:id'
    };

    this.bluth.find( params )
      .catch( function( error ) {
        done();
      } );

  } );

  it( 'should return a response schema', function( done ) {
    var params = {
      route: '/test/:id/something',
      method: 'POST',
      type: 'response',
      statusCode: 201
    };

    this.bluth.find( params )
      .then( function( schema ) {

        schema.should.be.type( 'object' );
        schema.title.should.containEql( params.method.replace( /\{([\w-_]+)\}/, ':$1' ) );
        schema.title.should.containEql( params.statusCode );

        done();

      } );

  } );

  it( 'should return a default response error schema if one is not present', function( done ) {
    var params = {
      route: '/test/:id/something',
      method: 'POST',
      type: 'response',
      statusCode: 418
    };

    this.bluth.find( params )
      .then( function( schema ) {

        schema.should.be.type( 'object' );
        schema.title.should.equal( defaultErrorSchema.title );

        done();

      } );

  } );

} );
