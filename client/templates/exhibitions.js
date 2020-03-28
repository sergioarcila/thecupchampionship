var FEATURED_COUNT = 4;

Template.exhibitions.onCreated( function(){
    Meteor.subscribe('rosters',Session.get('currentevent'));
    var unique = "a"+parseInt(Session.get('selectedYear')-2000)
    this.subscribe('matches',{year:unique,name:"all",event:Session.get('currentevent')});
    this.subscribe('members', {event:Session.get('currentevent'),name:"all"});
    var ready = this.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
    Session.set('sortMatch','previousnet');
})

Template.exhibitions.onRendered( function(){
    var e = Exhibitions.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    Session.set('selectedExhibition',e._id);
})
    
Template.exhibitions.events({
    'change .currentexhibition': function(event,template){
    var ID = currentexhibition.value; // could be the P or a child element
        if (ID == 'addexhibition'){
            console.log(template);
            Overlay.open('overlayadd',{type:'exhibition'});
        } else {
            Session.set('selectedExhibition',ID);
            var e = Exhibitions.findOne({_id:ID});
            Meteor.subscribe('matches',{year:e.unique,name:'all',event:Session.get('currentevent')});
        }
    },
    'click .accessmatches': function(event){
        console.log('test');
        Session.set('matchaccess',!Session.get('matchaccess'));
        console.log(Session.get('matchaccess'));
    },
    'click .changedayaccess': function(event){
    var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
    var didx = parseInt(event.currentTarget.id);
    console.log(e.access)  
    eval('Exhibitions.update({_id:e._id},{$set:{\'access.'+didx+'\':!e.access[didx]}});');
  },
    'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  },
    'change .sortfield': function(event){
    var matchsort = event.target.value; // could be the P or a child element
    Session.set('sortMatch',matchsort);   
    },
    'click .js-question': function() {
    Overlay.open('overlay2', Exhibitions.findOne({_id:Session.get('selectedExhibition')}));
  },
  'click .CHminutes':function(event){
        var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
        var ID = e.unique+parseInt(Session.get('selectedYear')-2000);
        var m = Matches.find({matchID:{$regex:ID},event:Session.get('currentevent')});
        m.forEach(function(mm){
            console.log('entered',mm.matchID);
            var t2 = moment(mm.time).add(parseInt(event.target.id), 'm')._d;
            Matches.update({_id:mm._id},{$set:{time:t2}})
        })
    }
    
});

Template.exhibitions.helpers({
daysummary: function(day){
    var yidx = 100*(Session.get('selectedYear')-2000);
    var m = Matches.find({event:Session.get("currentevent"),day:day,matchID:{$gt:yidx,$lt:yidx+100}},{sort:{matchID:1}}); var mn=0; var pts = 0; var mid1;
    m.forEach(function(x){
        if (mn==0){mid1 = x.matchID;}
        mn++; 
        if (x.ptsavail !== undefined){
            pts = pts+x.ptsavail.values[0]+x.ptsavail.values[1]+x.ptsavail.values[2];
        }
        else {
            switch (x.type){
                case 'singles':
                    pts = pts+2;
                    break;
                case 'bestball':
                    pts = pts+2;
                    break;
                case 'shamble':
                    pts = pts+4;
                    break;
            }
        }
    })
        
    return mn + " matches | " + pts + " pts available | " + getteetime(mid1,'time');
  },    
  // selects FEATURED_COUNT number of recipes at random
    T1: function() {
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1})
},
T2: function() {
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0})
}, 
  current: function(){
    return Meteor.user()
  },
    accessopen: function(didx){
        var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')},{access:1});
        return e.access[didx]
    },
  iscurrentUser: function(){
    return !(Meteor.user() == 'undefined')
  },
  activities: function() {
    return Activities.latest();
  },
  getexhibitions: function (){
    return Exhibitions.find({event:Session.get('currentevent'),year:Session.get('selectedYear')},{sort:{year:1}});  
  },
  iscurrentyear: function (year){
      var out = "";
    if (year == Session.get("selectedYear")){out = "selected";}
      return out
  },
  firstmatch: function(ID){
    var e = Exhibitions.findOne({_id:ID});
    mid = e.unique+(e.year-2000);
    return Matches.findOne({matchID:{$regex:mid}},{sort:{time:1}});
  },
  isExhibitionSelected: function(id){
    if (Session.get("selectedExhibition") == id){return "selected"}
  },
  exhibitionmatch: function() {
    var y = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
    var ID = y.unique+(y.year-2000);  var sortstr = Session.get('sortMatch');
    if (y.handicap){
        
        if (sortstr == 'previousnet'){
            return eval('Matches.find({event:Session.get(\'currentevent\'),matchID:{$regex:ID}},{sort: {\'previous.net\':1,time:1}});');
        }
        else {
            return eval('Matches.find({event:Session.get(\'currentevent\'),matchID:{$regex:ID}},{sort: {'+sortstr+':1,time:1}});');
        }
    } else {
        sortstr = 'status';
        return eval('Matches.find({event:Session.get(\'currentevent\'),matchID:{$regex:ID}},{sort: {'+sortstr+':1,time:1}});');
    }
    
  },
  latestNews: function() {
    return News.latest();
  },
  bestPlayer: function() {
    return Members.findOne({},{sort: {score: -1}, limit: 1});
  },
  exhibitioninfo: function () {
    return Exhibitions.findOne({event:Session.get('currentevent'),_id:Session.get("selectedExhibition")}); 
},
  courseinfo: function (course){
    return Courses.find({description:course})
  },
  ismatchpopulated: function (matchID) { //need to fix
      var x = Matches.findOne({matchID:matchID}); var P11 = " " + x.P11; var P12 = " " + x.P12; var P21 = " " + x.P21; var P22 = " " + x.P22;
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