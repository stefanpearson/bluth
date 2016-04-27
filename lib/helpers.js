// External dependencies
var _ = require( 'lodash' ),
    Promise = require( 'bluebird' );


/**
 * Find endpoint in blueprint object
 */
var findEndpointInBlueprint = function findEndpointInBlueprint( blueprint, params ) {
  var blueprintizedRoute = params.route.replace( /:([\w_-]+)[\s]*/g, '{$1}' ),
      endpoint;

  _.find( blueprint.ast.resourceGroups, function( resourceGroup ) {

    endpoint = _.find( resourceGroup.resources, function( resource ) {
      return resource.uriTemplate.split( '?' )[ 0 ] === blueprintizedRoute;
    } );

    return endpoint;
  } );

  if ( !endpoint ) {
    return Promise.reject( new Error( 'Bluth: Couldn\'t find endpoint' ) );
  }

  return Promise.resolve( endpoint );
};


/**
 * Find action in blueprint endpoint
 */
var findActionInEndpoint = function findActionInEndpoint( endpoint, params ) {
  var action;

  action = _.find( endpoint.actions, function( action ) {
    return action.method.toUpperCase() == params.method.toUpperCase();
  } );

  if ( !action ) {
    return Promise.reject( new Error( 'Blueprint: Couldn\'t find action' ) );
  }

  return Promise.resolve( action );
};


/**
 * Find schema in blueprint action
 */
var findSchemaInAction = function findSchemaInAction( action, params ) {
  var schema,
      targetSchema;

  // Find schema
  switch ( params.type ) {
    case 'request':
      targetSchema = action.examples[ 0 ].requests[ 0 ].schema;
      break;

    case 'response':
      targetSchema = _.find( action.examples[ 0 ].responses, { name: params.statusCode.toString() } );
      if ( targetSchema ) {
        targetSchema = targetSchema.schema;
      }
      break;
  }

  if ( !targetSchema && params.type == 'response' ) {

    if ( this.config.defaultErrorSchema ) {
      return Promise.resolve( this.config.defaultErrorSchema );
    } else {
      return Promise.reject( new Error( 'Bluth: Could not find JSON Schema' ) )
    }

  } else {

    try {
      schema = JSON.parse( targetSchema );
    } catch( error ) {
      return Promise.reject( new Error( 'Bluth: Could not parse JSON Schema' ) );
    }

    return Promise.resolve( schema );

  }

};


// Exports
module.exports = {
  findEndpointInBlueprint: findEndpointInBlueprint,
  findActionInEndpoint: findActionInEndpoint,
  findSchemaInAction: findSchemaInAction
};
