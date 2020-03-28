(function(){Rosters = new Mongo.Collection('rosters');

Rosters.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  },
  update: function(userId){
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  }
    
});
}).call(this);
