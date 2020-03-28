Events = new Mongo.Collection('events');

Events.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  }
});