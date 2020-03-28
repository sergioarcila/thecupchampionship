Rosters = new Mongo.Collection('rosters');

Rosters.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  }
    
});