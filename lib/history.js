History = new Mongo.Collection('history');

History.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  },
  remove: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  }    
});