Files = new Mongo.Collection('files');

Files.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  }

});