Members = new Mongo.Collection('members');

Members.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    //return user && user.admin;
      return true;
  },
  update: function(userId) {
    var user = Meteor.users.findOne(userId);
    return true;
  }
});