Template.recipeItem.helpers({
  getmemberimageURL: function (screenName) {
    var cursor = Meteor.users.find({"services.twitter.screenName":screenName}); var URL;
    cursor.forEach(function(x){URL = x.services.twitter.profile_image_url_https;})
    //console.log(screenName + URL);
    return URL
  },
  path: function () {
    return Router.path('recipe', this.recipe);
  },
  highlightedClass: function () {
    if (this.size === 'large')
      return 'highlighted';
  },
  bookmarkCount: function () {
    var count = BookmarkCounts.findOne({recipeName: this.name});
    return count && count.count;
  },
  ischoice: function(str){
    return str == Session.get('sortstr').type;
},
    getplayerteam: function(){
    return Rosters.findOne({year:Session.get('selectedYear'),members:this.name})
  }
});

Template.recipeItem.events({
'click .tenure': function(event) {
    Session.set('sortstr',{type:'tenure',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },
'click .cupresult': function(event) {
    Session.set('sortstr',{type:'cupresult',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },
'click .draftperc': function(event) {
    Session.set('sortstr',{type:'draftperc',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },
'click .power': function(event) {
    Session.set('sortstr',{type:'power',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },    
'click .impact': function(event) {
    Session.set('sortstr',{type:'impact',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },
'click .points': function(event) {
    Session.set('sortstr',{type:'points',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  },
'click .winperc': function(event) {
    Session.set('sortstr',{type:'winperc',dir:-1*Session.get('sortstr').dir});
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
  }
});
