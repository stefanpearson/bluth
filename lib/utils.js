// External dependencies
var Promise = require( 'bluebird' );


/**
 * Promisify all functions on an object, with a suffix of 'Promise'
 * e.g. someMethod => someMethodPromise
 */
var promisify = function promisify( obj ) {
  return Promise.promisifyAll( obj, { suffix: 'Promise' } );
};


// Exports
module.exports = {
  promisify: promisify
};
