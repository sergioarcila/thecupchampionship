Media = new Mongo.Collection('media');

Media.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return true;
  }

});