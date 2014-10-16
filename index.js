// External dependencies
var protagonist = require( 'protagonist' ),
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

    for ( key in options ) {
      if ( options.hasOwnProperty( key ) ) {
        this[ key ] = options[ key ];
      }
    }

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
 * @param options.statusCode {String, Number} Status code if options.type = 'response'
 */
BlueprintSchema.prototype.get = function get( options, done ) {

  // TODO: validate arguments

  async.waterfall( [

    function findEndpoint( done ) {
      var blueprintizedRoute = options.route.replace( /:([\w_-]+)[\s\/]*/, '{$1}' ),
          endpoint;

      _.find( this.blueprint.ast.resourceGroups, function ( resourceGroup ) {
        endpoint = _.find( resourceGroup.resources, function ( resource ) {
          return resource.uriTemplate === blueprintizedRoute;
        } );
        return endpoint;
      } );

      if ( !endpoint ) {
        return done( 'No endpoint' );
      }

      done( null, endpoint );

    }.bind( this ),

    function findAction( endpoint, done ) {

      var action = _.find( endpoint.actions, function ( action ) {
        return action.method.toUpperCase() === options.method.toUpperCase();
      } );

      if ( !action ) {
        return done( 'No action' );
      }

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

        case 'response':
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
 * @param options.statusCode {String, Number} Status code if options.type = 'response'
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
