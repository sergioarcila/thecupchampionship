Matches = new Mongo.Collection('matches');

Matches.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  }

});