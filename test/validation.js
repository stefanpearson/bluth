// External dependencies
var fs = require( 'fs' ),
    should = require( 'should' );


// Dependencies
var Bluth = require( '../' ),
    defaultErrorSchema = require( './fixtures/default-error-schema' );


var blueprintMd = fs.readFileSync( __dirname + '/./fixtures/blueprint.md' ).toString();


describe( 'Validation', function() {

  before( function () {

    this.bluth = new Bluth( blueprintMd, {
      defaultErrorSchema: defaultErrorSchema
    } );

  } );

  it( 'should pass validation when valid data is provided', function( done ) {

    this.bluth.validate( {
      name: 'G.O.B.',
      noiseAChickenMakes: 'Caw! Ca-caw!'
    }, {
      route: '/test/:id/something',
      method: 'POST',
      type: 'request'
    } )
      .then( function() {
        done();
      } );

  } );

  it( 'should return a list of errors when invalid data is provided', function( done ) {

    this.bluth.validate( {
      name: 'G.O.B.',
      noiseAChickenMakes: 'Cluck',
      invalidProperty: 'BEES?!'
    }, {
      route: '/test/:id/something',
      method: 'POST',
      type: 'request'
    } )
      .catch( function( error ) {
        done();
      } );

  } );

} );
