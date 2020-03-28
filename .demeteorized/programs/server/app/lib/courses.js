(function(){Courses = new Mongo.Collection('courses');

Courses.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  }
});
}).call(this);
