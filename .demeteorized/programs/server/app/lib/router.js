(function(){var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  Meteor.subscribe('news');
  Meteor.subscribe('members');
    Meteor.subscribe('matches');
  Meteor.subscribe('bookmarkCounts');
    Meteor.subscribe('cups');
     Meteor.subscribe('rosters');
     Meteor.subscribe('courses');
    Meteor.subscribe('users');
    Meteor.subscribe('history');
    Meteor.subscribe('exhibitions');

  feedSubscription = Meteor.subscribe('feed');
    
    Session.setDefault("selectedYear", 2016);
    Session.setDefault("scorekeepinghole",1);
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('latestActivity', function () {
      dataReadyHold.release();
    });
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function () {
    this.feedSubscription = feedSubscription;
  }
});

RecipesController = RouteController.extend({
  data: function () {
    return _.values(RecipesData);
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function () {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function () {
    if (Meteor.user())
      return _.values(_.pick(RecipesData, Meteor.user().bookmarkedRecipeNames));
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('recipe', this.params.name);
  },
  data: function () {
    //return RecipesData[this.params.name];
      return Members.findOne({_id:this.params.name})
  }
});

MatchController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('match', this.params.name);
  },
  data: function () {
    //return RecipesData[this.params.name];
      return Matches.findOne({matchID:this.params.name})
  }
});

AdminController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('news');
  }
});

Router.route('home', {
  path: '/'
});

Router.route('feed');
Router.route('recipes');
Router.route('bookmarks');
Router.route('about');
Router.route('admin');
Router.route('exhibitions');
Router.route('recipe', {
  //path: '/recipes/:name'
  path: '/:name'    
});
Router.route('match', {
  //path: '/recipes/:name'
  path: 'matchID'    
});

Router.route('admin', {
  layoutTemplate: null
});

Router.onBeforeAction('dataNotFound', {
  only: 'recipe'
});

}).call(this);
