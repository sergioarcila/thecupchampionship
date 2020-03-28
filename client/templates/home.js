var FEATURED_COUNT = 4;
var TAB_KEY = 'homeShowTab';
var newmatch = { 
    "matchID" : 1801, 
    "type" : "", 
    "hole" : 0, 
    "time" : "",
    "T1pts" : 0, 
    "T2pts" : 0, 
    "status" : 1, 
    "course" : "wildcat2", 
    "statusF9" : 0, 
    "statusB9" : 0, 
    "day" : 1, 
    "T1chances" : 0, 
    "T2chances" : 0, 
    "T1odds" : "EVEN", 
    "T2odds" : "EVEN", 
    "stats" : {
        "predict" : [
            0, 
            0
        ], 
        "dH" : 0, 
        "powerT1" : [50,50], 
        "powerT2" : [50,50]
    }, 
    "record" : {
        "par3" : [
            0, 
            0, 
            0
        ], 
        "par4" : [
            0, 
            0, 
            0
        ], 
        "par5" : [
            0, 
            0, 
            0
        ]
    }, 
    "predict" : [
        0, 
        0
    ], 
    "event" : "thecup", 
    "holes" : {
        "h1" : {
            "result" : 2, 
            "status" : {
                "all" : 0, 
                "f9" : "N", 
                "b9" : "N"
            }, 
            "location" : "", 
            "event" : {
                "status" : "", 
                "leads" : "", 
                "predict" : ""
            }, 
            "time" : {
                "expected" : "2017-09-08T14:15:00.985+0000"
            }
        }
    },
    "T1" : [
        "", 
        ""
    ], 
    "T2" : [
        "", 
        ""
    ], 
    "active" : 0
};

//Template.home.onCreated(function(){
  // subscribe to the publication responsible for sending the Pushups
  // documents down to the client
    //var ready = this.subscribe('matches', {event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'})
    //this.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
    //this.subscribe('rosters',Session.get("currentevent"));
    //});
    Template.home.onCreated(function() {
        this.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
        this.subscribe('rosters',Session.get("currentevent"));
        this.subscribe('matches', {event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'})
});



Template.home.onRendered(function(){
    Session.set('sortMatch','time')
});
   //extractMeta('https://cdn.filestackcontent.com/ZF6r5mcOSIOPcRuXG38i', function (err, res) { console.log(res); });
    //sAlert.info('<a href="/">Wow, you should be here.</a>', {effect: 'slide', html:true, position: 'bottom', timeout: 'none', onRouteClose: true, stack: false, offset: '0px'});
    ///if (!Meteor.user()) {
//    Overlay.open('overlayadmin');
  //} 

// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over


Template.home.events({
    'click #newmatch': function(event,template){
        var T1 = document.getElementById("T1").value;
        var T2 = document.getElementById("T2").value;   
        var type = document.getElementById("type").value;
        var addT = document.getElementById("addT").value;
        var yridx = 100*(Session.get('selectedYear')-2000);
        var m = Matches.findOne({event:Session.get('currentevent'),matchID:{$gt:yridx,$lt:yridx+100}},{sort:{matchID:-1}});
        if (m == undefined) {var m = newmatch; m.time = new Date('2016-09-08 13:00:00'); console.log(m);}
        else {
            var matchID = parseInt(m.matchID)+1; 
            //m.time = moment(m.time).add(parseInt(document.getElementById("addT").value), 'minutes'); 
            m.matchID=matchID; m.type = type; m.time = new Date(m.time.setTime(m.time.getTime()+ addT*60*1000));
        } 
        //Parse member list, split input string with " and "
        T1 = T1.split(" and ");
        T2 = T2.split(" and ");
        
        m.T1 = T1;m.T2 = T2; var t = new Date(m.time);
        for (var i1=2;i1<19;i1++){       
            eval('m.holes.h'+i1+' = {};'); 
            eval('m.holes.h'+i1+' =  m.holes.h'+ (i1-1)); 
            t = new Date(t.setTime(t.getTime()+15*60*1000));
            eval('m.holes.h'+i1+'.time.expected = t;');
        }
        delete m._id;
        Matches.insert(m);
        alert(m.matchID,' added! ',m.type);
},
    'click .accessmatches': function(event){
        Session.set('matchaccess',!Session.get('matchaccess'));
        console.log(Session.get('matchaccess'));
        Meteor.subscribe('members',{event:Session.get('currentevent'),name:'all'});
    },
    'click .addminutes':function(event){
        var yrIDX = 100*(Session.get('selectedYear')-2000);
        var m = Matches.find({matchID:{$gt:yrIDX,$lt:yrIDX+100},day:parseInt(event.target.id),event:Session.get('currentevent')});
        m.forEach(function(mm){
            var t2 = moment(mm.time).add(10, 'm')._d;
            Matches.update({_id:mm._id},{$set:{time:t2}})
        })
    },
    'click .subtractminutes':function(event){
        var yrIDX = 100*(Session.get('selectedYear')-2000);
        var m = Matches.find({matchID:{$gt:yrIDX,$lt:yrIDX+100},day:parseInt(event.target.id),event:Session.get('currentevent')});
        m.forEach(function(mm){
            var t2 = moment(mm.time).subtract(10, 'm')._d;
            Matches.update({_id:mm._id},{$set:{time:t2}})
        })
    },
    'change .currentyear': function(){
    var year = currentyear.value; // could be the P or a child element
    Session.set('selectedYear',parseInt(year));
    },
    'change .sortfield': function(event){
        var matchsort = event.target.value; // could be the P or a child element
        Session.set('sortMatch',matchsort); 
    },
    'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  },
      'click .js-question': function() {
    Overlay.open('overlay2', Cups.findOne({event:Session.get('currentevent'),year:parseInt(Session.get('selectedYear'))}));
  },
    'click .broadcastday': function() {
    Meteor.subscribe('media',Session.get('currentevent'),Session.get('selectedYear'));
    Overlay.open('shareOverlay', this);
  },
    'click .broadcastday2': function(event){
        
    if (Router.current().path == "/exhibitions"){var type = 'exhibitions';}
      else {var type = 'cup';}
      
      switch (type){
        case 'cup':
            var params = {day:event.target.id};
            var yridx = 100*(Session.get('selectedYear')-2000);
              console.log('finding media on day:',params.day);
              if (params.day){
                var m = Media.find({'data.event':Session.get('currentevent'),'data.day':parseInt(params.day),'data.matchID':{$gt:yridx,$lt:yridx+100}},{sort:{'info.hole':1}});
                  console.log('found media on day:',params.day);
              } else {
                var m = Media.find({'data.event':Session.get('currentevent'),'data.matchID':{$gt:yridx,$lt:yridx+100}},{sort:{'info.hole':1}});
              }
              
              
        break;
        case 'exhibition':
            var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
            var yri = (Session.get('selectedYear')-2000); var ID = e.unique+yri;
            var m = Media.find({'data.event':Session.get('currentevent'),'data.matchID':{$regex:ID}},{sort:{'info.hole':1}});
            break;
    }
    
    var IDs = []; var i = 0;
    m.forEach(function(mm){
        IDs[i] = mm._id; i++;
    })
      console.log(IDs)
      switch (type){
        case 'cup':
            var yridx = 100*(Session.get('selectedYear')-2000);
            Session.set('videoloop',{type:'cup',IDs:IDs,index:0});
            var m = Media.findOne({'_id':IDs[0]});
            Overlay.open('fileOverlay',m);
        break;
        case 'exhibitions':
            Session.set('videoloop',{type:'exhibition',IDs:IDs,index:0});
              var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
              var yri = (Session.get('selectedYear')-2000); var ID = e.unique+yri;
              if (e.type == 'stroke'){Overlay.open('fileOverlay2');}
              else {console.log('opening',m);Overlay.open('fileOverlay');}
        break;
      }
  
    },
  'click .js-show-main': function(event) {
    event.stopPropagation();
    Template.home.setTab('main')
  },
  
  'click .js-show-details': function(event) {
    event.stopPropagation();
    Template.home.setTab('details')
  },
  'click .changedayaccess': function(event){
    var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')},{_id:1,access:1});
    var didx = parseInt(event.currentTarget.id);
    console.log(c.access)  
    eval('Cups.update({_id:c._id},{$set:{\'access.'+didx+'\':!c.access[didx]}});');
  }
});

Template.home.helpers({
  //checkNotifications: function(){
  //    var c = Cups.findOne({event:'thecup',year:Session.get('selectedYear')});
  //    var m = Matches.find({predict:{$gt:10,$lt:12}});
  //    m.forEach(function(x){
  //              var str = c.T1 + ' is ' + 50-Math.max(predictedstatus) + ' pts ' + 'away from clinching The Cup. ' + x.P11 + '/' + x.P12 + ' can win it for them //on ' + m.hole+1;
  //              sAlert.info(str, {effect: 'slide', position: 'bottom', timeout: 'none', onRouteClose: true, stack: false, offset: '0px'});
  //    })      
  //},  
//  getMVP:function(t){//we don't want to subscribe to members on livescoring page. need for speed.
  //  var r = Rosters.findOne({defending:t,year:Session.get('selectedYear')});
//      console.log(r)
//    var m = Members.findOne({name:{$in:r.members},event:Session.get('currentevent')});
//      console.log(m)
//    return firstinitiallastname(m.name);
//  },    
  daysummary: function(day){
    var yidx = 100*(Session.get('selectedYear')-2000);
    var m = Matches.find({event:Session.get("currentevent"),day:day,matchID:{$gt:yidx,$lt:yidx+100}},{sort:{time:1}}); var mn=0; var pts = 0; var mid1;
    var c = Cups.findOne({event:Session.get("currentevent"),year:Session.get('selectedYear')});
    m.forEach(function(x){
        if (mn==0){mid1 = x.matchID;}
        mn++; 
        pts = pts + addarray(eval('c.formats.'+x.type+'.points'));
    })
        
    return mn + " matches | " + pts + " pts available | " + getteetime(mid1,'ddd MMM Do h:mm A');
  },
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  activeTabClass: function() {
    return Session.get(TAB_KEY);
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
  T1: function(){
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')})
  },
  T2: function(){
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')})
  },    
  //iscurrentUser: function(){
    //return !(Meteor.user() == 'undefined')
  //},
  getmatches: function(day) {
    var year = Session.get('selectedYear');
  
    var yearidx = (year-2000)*100; var sortBy = {};
    switch ( Session.get('sortMatch') ){
            case 'time':
                sortBy = {'time':1,'type':1};
            break;
            case 'impacts':
                sortBy = {'predict':-1};
            break;
            case 'powers':
                sortBy = {'stats.powerP11':-1};
            break;
            case 'status':
                sortBy = {'status':-1};
            break;        
    }      
        return Matches.find({day:day,type: { $ne: '' }, matchID:{$gt:yearidx,$lt:yearidx+100},event:Session.get("currentevent")},{sort: sortBy})
  },
  bestPlayer: function() {
    return Members.findOne({event:Session.get("currentevent")},{sort: {score: -1}, limit: 1});
  },
  courseinfo: function (day){
    var year = Session.get('selectedYear');
    var matchID = (year - 2000)*100;
    var m = Matches.findOne({matchID:{$gt:matchID,$lt:matchID+100},day:day,event:Session.get("currentevent")}); var coursedesc;
    coursedesc = m.course;
      console.log(coursedesc);
    return Courses.find({description:coursedesc})
  },
  ismatchpopulated: function (matchID) { //need to fix,no shit
      var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); 
      n = parseInt(m.T1[0][m.T1[0].length-1]);
      if (isNaN(n) || isAdmin()) {return 1;}
      else {return 0}
  },
    accessopen: function(didx){
        var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')},{access:1});
        return c.access[didx]
    }
});
