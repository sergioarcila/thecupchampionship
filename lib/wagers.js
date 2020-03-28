Wagers = new Mongo.Collection('wagers');

Wagers.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true
  },
  update: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true
  }
});