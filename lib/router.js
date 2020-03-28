var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
       
  //Meteor.subscribe('media');
  //Meteor.subscribe('members','perkins');
    //Meteor.subscribe('matches','perkins');
  Meteor.subscribe('bookmarkCounts');
    //Meteor.subscribe('cups');
     Meteor.subscribe('courses');
    Meteor.subscribe('users');
    Meteor.subscribe('exhibitions');
    Meteor.subscribe('events');
    
    //Meteor.subscribe('images2');
    Session.setDefault("selectedYear", 2019);
    Session.setDefault("scorekeepinghole",1);
    
    Session.setDefault("accessflag",1);
    Session.setDefault("mapmatch",1601);
    Session.setDefault("currentevent",'thecup');
    Session.setDefault("sortMatch",'time');
    Session.setDefault("sortfield",'powerprevious');
    Session.setDefault('ptschange',0);
    Session.setDefault('matchaccess',true);   
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
    
    //Meteor.setInterval(function() {
    //    Session.set('myDate', new Date);
    //  }, 10000);
}

//HomeController = RouteController.extend({
//  onBeforeAction: function () {
//    Meteor.subscribe('latestActivity', function () {
//      dataReadyHold.release();
//    });
//  }
//});

//FeedController = RouteController.extend({
//  onBeforeAction: function () {
//    this.feedSubscription = feedSubscription;
//  }
//});
      
//RecipesController = RouteController.extend({
//  data: function () {
//    return _.values(RecipesData);
//  }
//});

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

//MatchController = RouteController.extend({
//  onBeforeAction: function () {
//    Meteor.subscribe('match', this.params.name);
//  },
//  data: function () {
//    //return RecipesData[this.params.name];
//      return Matches.findOne({matchID:this.params.name})
//  }
//});

//AdminController = RouteController.extend({
//  onBeforeAction: function () {
//    Meteor.subscribe('news');
//  }
//});

Router.route('home', {
  path: '/'
});

Router.route('glance');
Router.route('analysis');
Router.route('feed');
Router.route('privacy');
Router.route('recipes');
Router.route('broadcastpreview');
Router.route('bookmarks');
Router.route('about');
Router.route('admin');
Router.route('exhibitions');
Router.route('mappage');
Router.route('wagers');
Router.route('recipe', {
  //path: '/recipes/:name'
  path: '/:name'    
});
Router.route('match', {
  //path: '/recipes/:name'
  path: 'matchID'    
});

Router.route('privacy', {
  path: 'privacy'    
});

Router.route('admin', {
  layoutTemplate: null
});

Router.onBeforeAction('dataNotFound', {
  only: 'recipe'
});
