var FEATURED_COUNT = 4;
var TAB_KEY = 'homeShowTab';


Template.glance.onCreated( () => {
  let template = Template.instance();  
    template.subscribe('rosters',Session.get("currentevent"));
    var event = Session.get('currentevent');
    var ready = template.subscribe('matches', {event:event, year:Session.get('selectedYear'),name:'all'})
    var ready = template.subscribe('members', {event:event,name:'all'});
});
// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.glance.setTab = function(tab) {
  var lastTab = Session.get(TAB_KEY);
  Session.set(TAB_KEY, tab);
  
  var fromHome = (lastTab === 'home') && (tab !== 'home');
  $('.feed-scrollable').toggleClass('instant', fromHome);

  var toHome = (lastTab !== 'home') && (tab === 'home');
  $('.feed-scrollable').toggleClass('delayed', toHome);
}


Template.glance.events({
    'change .currentyear': function(){
    var year = currentyear.value; // could be the P or a child element
    Session.set('selectedYear',year);
    },
    'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  },
      'click .js-question': function() {
    Overlay.open('overlay2', Cups.findOne({year:parseInt(Session.get('selectedYear'))}));
  },
  'click .js-show-main': function(event) {
    event.stopPropagation();
    Template.home.setTab('main')
  },
  
  'click .js-show-details': function(event) {
    event.stopPropagation();
    Template.home.setTab('details')
  }
});

Template.glance.helpers({
  getcurrentevent: function(){
    return Session.get("currentevent");
  },
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  activeTabClass: function() {
    return Session.get(TAB_KEY);
  },
  // selects FEATURED_COUNT number of recipes at random
  featuredRecipes: function() {
    var recipes = _.values(RecipesData);
    var selection = [];
    
    for (var i = 0;i < FEATURED_COUNT;i++)
      selection.push(recipes.splice(_.random(recipes.length - 1), 1)[0]);

    return 0;
  },
  getmatchday: function(didx){
      var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      midx = 100*(Session.get('selectedYear')-2000);
      //console.log(midx+Session.get('currentevent')+didx)
      var y = Matches.findOne({matchID:{$gt:midx,$lt:midx+100},day:parseInt(didx),event:Session.get("currentevent")});
      //console.log(y);
      return dayNames[y.time.getDay()]
  },
  current: function(){
    return Meteor.user()
  },
  iscurrentUser: function(){
    return !(Meteor.user() == 'undefined')
  },
  activities: function() {
    return Activities.latest();
  },
  getcups: function (){
    return Cups.find({event:Session.get("currentevent")},{sort:{year:-1}});  
  },
  iscurrentyear: function (year){
      var out = "";
    if (year == Session.get("selectedYear")){out = "selected";}
      return out
  },
  matchesD1: function() {
    var year = Session.get('selectedYear');  
    var yearidx = (year-2000)*100;
    return Matches.find({day:1,matchID:{$gt:yearidx,$lt:yearidx+100},event:Session.get("currentevent")},{sort: {time:1}});
  },
  matchesD2: function() {
    var year = Session.get('selectedYear');  
    var yearidx = (year-2000)*100;
    return Matches.find({day:2,matchID:{$gt:yearidx,$lt:yearidx+100},event:Session.get("currentevent")},{sort: {time:1,matchID:1}});
  },
    topperformers: function() {
        var yr = Session.get('selectedYear');
        return eval('Members.find({event:Session.get("currentevent")},{sort: {\'stats.y'+yr+'.impact\': -1}, limit: 3});');
  },
    worstperformers: function() {
        var yr = Session.get('selectedYear');
        return eval('Members.find({event:Session.get("currentevent")},{sort: {\'stats.y'+yr+'.impact\': 1}, limit: 3});');
  },
    trendingplayers: function(string) {
        var yr = Session.get('selectedYear');
        if (string == 'team'){
        return eval('Members.find({\'news.y'+yr+'.hotteamflag\':1},{sort: {\'stats.y'+yr+'.impact\': -1}});');
        }
        if (string == 'singles'){
        return eval('Members.find({\'news.y'+yr+'.hotsinglesflag\':1},{sort: {\'stats.y'+yr+'.impact\': -1}});');
        }
  },  
    plummetingplayers: function() {
        return eval('Members.find({\'news.y'+yr+'.plummetingflag\':1},{sort: {\'stats.y'+yr+'.impact\': -1}});');
  },  
    
  keymatches: function (){
    var yridx = 100*(Session.get("selectedYear")-2000);
    var m = Matches.find({matchID:{$gt:yridx,$lt:yridx+100}},{sort:{'stats.dH':1},limit:3});
      return m
  },
  latestNews: function() {
    return News.latest();
  },
  bestPlayer: function() {
    return Members.findOne({event:Session.get("currentevent")},{sort: {score: -1}, limit: 1});
  },
  cupinfo: function () {
    var year = Session.get("selectedYear");
    return Cups.find({year:parseInt(year),event:Session.get("currentevent")}); 
},
  courseinfo: function (day){
    var year = 2015;
    var matchID = (year - 2000)*100;
    var Cursor = Matches.find({matchID:{$gt:matchID,$lt:matchID+100},day:day,event:Session.get("currentevent")}); var coursedesc;
    Cursor.forEach(function(x){coursedesc = x.course;})
    return Courses.find({description:coursedesc})
  },
  ismatchpopulated: function (matchID) { //need to fix
      var x = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); var P11 = " " + x.P11; var P12 = " " + x.P12; var P21 = " " + x.P21; var P22 = " " + x.P22;
      var n = parseInt(P11[P11.length-1]+P12[P12.length-1]+P21[P21.length-1]+P22[P22.length-1]); 
      if (isNaN(n)) {return 1;}
      else {return 0}
  }
});

Handlebars.registerHelper('getcourseinfo', function(day){
    var selectedYear = parseInt(Session.get('selectedYear'));
    var matchID = (selectedYear - 2000)*100;
    var Cursor = MatchesList.find({matchID:{$gt:matchID,$lt:matchID+100},day:day}); var coursedesc;
    Cursor.forEach(function(x){
        coursedesc = x.course;
    })
    Cursor = CoursesList.find({description:coursedesc}); var club; var location; var name;
    Cursor.forEach(function(x){
        club = x.club;
        location = x.location;
        name = x.name;
    })
    var description = club + ", " + name + "; " + location;
    return description
})