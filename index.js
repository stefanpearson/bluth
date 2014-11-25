// External dependencies
var protagonist = require( 'protagonist' ),
    _ = require( 'lodash' ),
    jsonSchema = require( 'jsonschema' ),
    async = require( 'async' ),
    schema = require( 'validate' );


/**
 * Constructor
 *
 * @param blueprint {Object} API Blueprint
 * @param options {Object} Options
 * @param options.defaultErrorSchema {Object} JSON Schema for default error responses (400+)
 */
var BlueprintSchema = function BlueprintSchema( blueprint, options ) {

  if ( options && options.constructor === Object ) {

    for ( key in options ) {
      if ( options.hasOwnProperty( key ) ) {
        this[ key ] = options[ key ];
      }
    }

  }

  this.blueprint = blueprint;

  return this;
};


/**
 * Instantiate a BlueprintSchema after parsing an API Blueprint
 *
 * @param blueprintMd {String} API Blueprint markdown
 * @param options {Object} Options
 * @param options.defaultErrorSchema {Object} JSON Schema for default error responses (400+)
 */
BlueprintSchema.create = BlueprintSchema.prototype.create = function create( blueprintMd, options, done ) {

  if ( typeof blueprintMd !== 'string' ) {
    return done( new Error( 'Blueprint must be a markdown string' ) );
  }

  protagonist.parse( blueprintMd, function( error, result, warnings ) {

    if ( error ) {
      return done( error );
    }

    done( null, new BlueprintSchema( result, options ) );
  } );

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

  var optionsErrors = schema( {
    type: {
      type: 'string',
      required: true,
      match: /^request|response$/
    },
    route: {
      type: 'string',
      required: true
    },
    method: {
      type: 'string',
      required: true
    },
    statusCode: {
      type: 'string'
    }
  }, {
    typecast: true
  } ).validate( options );

  if ( optionsErrors.length ) {
    return done( new Error( 'invalid options' ) );
  }

  async.waterfall( [

    function findEndpoint( done ) {
      var blueprintizedRoute = options.route.replace( /:([\w_-]+)[\s]*/g, '{$1}' ),
          endpoint;

      _.find( this.blueprint.ast.resourceGroups, function( resourceGroup ) {
        endpoint = _.find( resourceGroup.resources, function( resource ) {
          return resource.uriTemplate.split( '?' )[ 0 ] === blueprintizedRoute;
        } );
        return endpoint;
      } );

      if ( !endpoint ) {
        return done( new Error( 'No endpoint' ) );
      }

      done( null, endpoint );

    }.bind( this ),

    function findAction( endpoint, done ) {
      var action;

      action = _.find( endpoint.actions, function( action ) {
        return action.method.toUpperCase() === options.method.toUpperCase();
      } );

      if ( !action ) {
        return done( new Error( 'No action' ) );
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
          targetSchema = _.find( action.examples[ 0 ].responses, { name: options.statusCode } );
          if ( targetSchema ) {
            targetSchema = targetSchema.schema;
          }
          break;
      }

      if ( !targetSchema && options.type === 'response' ) {

        if ( this.defaultErrorSchema ) {
          return done( null, this.defaultErrorSchema );
        } else {
          return done( new Error( 'Could not find JSON Schema' ) );
        }

      } else {

        try {
          schema = JSON.parse( targetSchema );
        } catch( error ) {
          return done( new Error( 'Could not parse JSON Schema' ) );
        }

        return done( null, schema );

      }

    }.bind( this )

  ], function finalCallback( error, schema ) {

    if ( error ) {
      return done( new Error( 'Could not find a valid schema for ' + options.route + ' ' + options.method + ': ' + error ) );
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

  this.get( options, function( error, schema ) {
    var result;

    if ( error ) {
      return done( error );
    }

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
