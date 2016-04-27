// External dependencies
var fs = require( 'fs' ),
    should = require( 'should' );


// Dependencies
var Bluth = require( '../' );


var blueprintMd = fs.readFileSync( __dirname + '/./fixtures/blueprint.md' ).toString();


describe( 'Instantiation', function() {

  it( 'should create an instance of Bluth', function( done ) {
    var bluth = new Bluth( blueprintMd );

    bluth.get()
      .then( function( blueprint ) {
        done();
      } );

  } );

  it( 'should return an error if Blueprint is not a string', function() {

    try {
      var bluth = new Bluth( {}, {} );
    } catch ( error ) {
      should.exist( error );
    }

  } );

  it( 'should have config properties set on the instance', function() {
    var bluth = new Bluth( blueprintMd, {
      bees: 'BEADS?!'
    } );

    bluth.config.should.have.property( 'bees' ).and.equal( 'BEADS?!' );

  } );

} );
