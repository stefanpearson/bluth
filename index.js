// External dependencies
var fs = require( 'fs' ),
    protagonist = require( 'protagonist' ),
    _ = require( 'lodash' ),
    jsonSchema = require( 'jsonschema' ),
    async = require( 'async' );


/**
 * Constructor
 *
 * @param blueprintMd {String} API Blueprint markdown
 * @param options {Object} Options
 * @param options.defaultErrorSchema {Object} JSON Schema for default error responses (400+)
 */
var BlueprintSchema = function BlueprintSchema( blueprintMd, options ) {

  if ( options && options.constructor === Object ) {

    options.forEach( function ( value, key ) {
      this[ key ] = value;
    } );

  }

  protagonist.parse( blueprintMd, function ( error, result ) {

    if ( error ) {
      throw error;
    }

    this.blueprint = result;

  }.bind( this ) );

  return this;
};


BlueprintSchema.prototype = {
  blueprint: {}
};


/**
 * Get schema
 *
 * @param options {Object} Options
 * @param options.type {String} Payload type, 'request' or 'response'
 * @param options.route {String} Route path
 * @param options.method {String} Route method
 */
BlueprintSchema.prototype.get = function get( options, done ) {

  // TODO: validate arguments

  async.waterfall( [

    function findEndpoint( done ) {
      var endpoint;

      _.find( blueprint.ast.resourceGroups, function ( resourceGroup ) {
        endpoint = _.find( resourceGroup.resources, function ( resource ) {
          return resource.uriTemplate === blueprintizedRoute;
        } );
        return endpoint;
      } );

      done( null, endpoint );

    }.bind( this ),

    function findAction( endpoint, done ) {
      var action = _.find( endpoint.actions, function ( action ) {
        return action.method.toUpperCase() === options.method.toUpperCase();
      } );

      done( null, action );

    }.bind( this ),

    function findSchema( action, done ) {
      var schema,
          targetSchema;

      // Find schema
      switch ( options.type ) {
        case 'request':
          targetSchema = action.examples[ 0 ].requests[ 0 ].schema;
          break;

        case 'response';
          // TODO: find target based on response status
          break;
      }

      if ( !targetSchema && options.type === 'response' ) {

        if ( this.defaultErrorSchema ) {
          return done( null, this.defaultErrorSchema );
        } else {
          return done( 'Could not find JSON Schema' );
        }

      } else {

        try {
          schema = JSON.parse( targetSchema );
        } catch( error ) {
          return done( 'Could not parse JSON Schema' );
        }

        return done( null, schema );

      }

    }.bind( this )

  ], function finalCallback( error, schema ) {

    if ( error ) {
      return done( 'Could not find a valid schema for ' + options.route + ' ' + options.method );
    }

    done( null, schema );

  }.bind( this ) );

};


/**
 * Validate against schema
 *
 * @param data {Object} Data to validate
 * @param options {Object} Options
 * @param options.type {String} Payload type, 'request' or 'response'
 * @param options.route {String} Route path
 * @param options.method {String} Route method
 * @param options.statusCode {String, Number} Status code if options.type is
 * @param done {Function} callback
 */
BlueprintSchema.prototype.validate = function validate( data, options, done ) {

  // TODO: validate arguments

  this.get( options, function ( error, schema ) {
    var result;

    try {
      result = jsonSchema.validate( data, schema );
    } catch ( error ) {
      return done( error );
    }

    done( null, result );

  } );

};


// Exports
module.exports = BlueprintSchema;
