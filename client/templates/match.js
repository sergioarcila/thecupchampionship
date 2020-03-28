var TAB_KEY = 'recipeShowTab';

// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.match.setTab = function(tab) {
  var lastTab = Session.get(TAB_KEY);
  Session.set(TAB_KEY, tab);
  
  var fromRecipe = (lastTab === 'match') && (tab !== 'match');
  $('.feed-scrollable').toggleClass('instant', fromRecipe);

  var toRecipe = (lastTab !== 'match') && (tab === 'match');
  $('.feed-scrollable').toggleClass('delayed', toRecipe);
}

Template.match.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  activeTabClass: function() {
    return Session.get(TAB_KEY);
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeNames, this.name);
  },
  activities: function() {
    return Activities.find({recipeName: this.name}, {sort: {date: -1}});
  },
  current: function(){
    return Meteor.user()
},
  iscurrentUser: function(){
     return !(Meteor.user() == 'undefined')
    },
getmemberprofile: function(id){
    return Members.find({_id:id});
  },
gettwitter: function(screenName){
    return Meteor.users.find({'services.twitter.screenName':screenName})
},
    
 getcurrentteam: function(id){
    var y = Members.findOne({_id:id}); var i = 0;
    var x = Rosters.find({year:2015,members:{$in:[y.name]}});
    return x
 },
getplayerteam: function(name, year){
    return Rosters.find({year:year,members:{$in:[name]}});
},
getmatchesplayer: function(name){
    return Matches.find({$or: [{P11: name},{P12: name},{P21: name},{P22: name}] },{sort:{matchID:-1}})
}
});

Template.match.events({
  'click .js-add-bookmark': function(event) {
    event.preventDefault();

    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    
    Meteor.call('bookmarkRecipe', this.name);
  },

  'click .js-remove-bookmark': function(event) {
    event.preventDefault();

    Meteor.call('unbookmarkRecipe', this.name);
  },
  
  'click .js-show-recipe': function(event) {
    event.stopPropagation();
    Template.recipe.setTab('make')
  },
  
  'click .js-show-feed': function(event) {
    event.stopPropagation();
    Template.recipe.setTab('feed')
  },
  
  'click .js-uncollapse': function() {
    Template.recipe.setTab('match')
  },

  'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  }
});
