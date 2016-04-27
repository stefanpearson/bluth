// External dependencies
var protagonist = require( 'protagonist' ),
    _ = require( 'lodash' ),
    jsonSchema = require( 'jsonschema' ),
    Promise = require( 'bluebird' );


// Dependencies
var helpers = require( './helpers' );


// Promisify libraries
protagonist = Promise.promisifyAll( protagonist, { suffix: 'Promise' } );


/**
 * Bluth Constructor
 *
 * @param blueprintString {String} API Blueprint string
 * @param options {Object} Options
 * @param options.defaultErrorSchema {Object} JSON Schema for default error responses (400+)
 */
var Bluth = function Bluth( blueprintString, options ) {

  if ( typeof blueprintString !== 'string' ) {
    throw new Error( 'Bluth: Blueprint must be a parseable Markdown string' );
  }

  this.config = _.extend( {}, options || {} );
  this.blueprintString = blueprintString;

  return this;
};


/**
 * Get Blueprint object
 * Parses Blueprint on first invocation, otherwise resolves with cached result
 */
Bluth.prototype.get = function get() {

  if ( this.blueprint ) {
    return Promise.resolve( this.blueprint );
  } else {
    return protagonist.parsePromise( this.blueprintString, { type: 'ast' } )
      .bind( this )
      .tap( function( result ) {
        this.blueprint = result;
      } );
  }

};


/**
 * Find schema within Blueprint
 *
 * @param params {Object} Options
 * @param params.type {String} Payload type, 'request' or 'response'
 * @param params.route {String} Route path
 * @param params.method {String} Route method
 * @param params.statusCode {String, Number} Status code, required if params.type = 'response'
 */
Bluth.prototype.find = function find( params ) {
  return this.get()
    .bind( this )
    .then( function( blueprint ) {
      return helpers.findEndpointInBlueprint.apply( this, [ blueprint, params ] );
    } )
    .then( function( endpoint ) {
      return helpers.findActionInEndpoint.apply( this, [ endpoint, params ] );
    } )
    .then( function( action ) {
      return helpers.findSchemaInAction.apply( this, [ action, params ] );
    } );
};


/**
 * Validate payload against given schema
 *
 * @param data {Object} Data to validate
 * @param params {Object} Options
 * @param params.type {String} Payload type, 'request' or 'response'
 * @param params.route {String} Route path
 * @param params.method {String} Route method
 * @param params.statusCode {String, Number} Status code, required if params.type = 'response'
 */
Bluth.prototype.validate = function validate( data, params ) {
  return this.find( params )
    .then( function( schema ) {
      var validationResult = jsonSchema.validate( data, schema ),
          validationError;

      if ( validationResult.errors.length ) {
        validationError = new Error( 'Bluth: Validation errors' );
        validationError.errors = validationResult.errors;
        throw validationError;
      }

      return validationResult;
    } );
};


// Exports
module.exports = Bluth;
