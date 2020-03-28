(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var wrapAsync;

(function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/meteorhacks_aggregate/packages/meteorhacks_aggregate.js         //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
(function () {

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/meteorhacks:aggregate/index.js                            //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
wrapAsync = (Meteor.wrapAsync)? Meteor.wrapAsync : Meteor._wrapAsync; // 1
Mongo.Collection.prototype.aggregate = function(pipelines, options) { // 2
  var coll;                                                           // 3
  if (this.rawCollection) {                                           // 4
    // >= Meteor 1.0.4                                                // 5
    coll = this.rawCollection();                                      // 6
  } else {                                                            // 7
	// < Meteor 1.0.4                                                    // 8
    coll = this._getCollection();                                     // 9
  }                                                                   // 10
  return wrapAsync(coll.aggregate.bind(coll))(pipelines, options);    // 11
}                                                                     // 12
                                                                      // 13
////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:aggregate'] = {};

})();
