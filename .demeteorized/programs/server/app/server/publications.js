(function(){Meteor.publish('bookmarkCounts', function() {
  return BookmarkCounts.find();
});

Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

Meteor.publish('members', function() {
  return Members.find();
});

Meteor.publish('courses', function() {
  return Courses.find();
});

Meteor.publish('cups', function() {
  return Cups.find();
});

Meteor.publish('rosters', function() {
  return Rosters.find();
});

Meteor.publish('matches', function() {
  return Matches.find();
});

Meteor.publish('history', function() {
  return History.find();
});

Meteor.publish('latestActivity', function () {
  return Activities.latest();
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('users', function() {
return Meteor.users.find();
});

Meteor.publish('exhibitions', function() {
return Exhibitions.find();
});

Meteor.publish('recipe', function(name) {
  check(name, String);
  return [
    BookmarkCounts.find({recipeName: name}),
    Activities.find({recipeName: name})
  ];
});



// autopublish the user's bookmarks and admin status
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {
    fields: {
      admin: 1,
      bookmarkedRecipeNames: 1,
      'services.twitter.profile_image_url_https': 1,
      'services.twitter.screenName':1
    }
  });
})
}).call(this);
