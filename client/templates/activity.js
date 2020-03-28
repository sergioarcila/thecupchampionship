Template.activity.onRendered(function() {   
    var self = this;

  // If the activity is in a list, scroll it into view. Note, we can't just use
  // element.scrollIntoView() because it attempts to scroll in the X direction
  // messing up our animations
  if (Router.current().params.activityId === self.data._id){
    var $activity = $(self.firstNode);
    var top = $activity.offset().top;
    var $parent = $(self.firstNode).closest('.content-scrollable');
    var parentTop = $parent.offset().top;
    $parent.scrollTop(top - parentTop);
  }
});

Template.activity.events({
  'change .playerpick': function(){
        var str = event.target.id.split("_");
        var matchID = parseInt(str[0]);
        if (matchID == NaN){var m = Matches.findOne({matchID:str[0],event:Session.get('currentevent')});}
        else {var m = Matches.findOne({matchID:matchID,event:Session.get('currentevent')});}
        var tID = parseInt(str[1]);
        var pID = parseInt(str[2]);
        eval('Matches.update({_id:m._id},{$set:{\'T'+tID+'.'+pID+'\':event.target.value}})');
        var M = Members.findOne({event:Session.get('currentevent'),name:event.target.value});
        console.log(M);
        eval('Matches.update({_id:m._id},{$set:{\'stats.powerT'+tID+'.'+pID+'\':M.stats.y'+Session.get('selectedYear')+'.power}})');
  },
  'click .js-signin': function() {
    Overlay.open('overlayadmin');
  },
  'click .js-match': function() {
    if (!isAdmin() || !Session.get('matchaccess')){Overlay.open('overlaymatch', this);}
    //Session.set('showscoringpane',!Session.get('showscoringpane')); 
  },
  'click .js-share': function() {
    Meteor.subscribe('media',Session.get('currentevent'),Session.get('selectedYear'));
    Overlay.open('shareOverlay', this);
  },
  'click .timeCH':function(event){
      var dir = parseInt(event.target.id);
      var t1 = this.time; var t2;
      var iyr = 100*(Session.get('selectedYear')-2000);
      //find next match
      if (dir>0){var m = Matches.findOne({event:Session.get('currentevent'),matchID:{$gt:iyr,$lt:iyr+100},day:this.day,time:{$gt:t1}},{sort:{time:1}}); t2 = m.time;}
      if (dir<0){var m = Matches.findOne({event:Session.get('currentevent'),matchID:{$gt:iyr,$lt:iyr+100},day:this.day,time:{$lt:t1}},{sort:{time:-1}}); t2 = m.time;}
      
      //find all matches with current time, change time to t2
      var M1 = Matches.find({event:Session.get('currentevent'),matchID:{$gt:iyr,$lt:iyr+100},day:this.day,time:t1}); 
      var iM1 = []; var i =0;
      M1.forEach(function(m1){
        iM1[i] = m1._id;
        //console.log(m1.matchID,t1,'switching to', t2);
        //Matches.update({_id:m1._id},{$set:{time:t2}});
      })
      
      var M2 = Matches.find({event:Session.get('currentevent'),matchID:{$gt:iyr,$lt:iyr+100},day:this.day,time:t2});
      var iM2 = []; var i =0;
      M2.forEach(function(m2){
        iM2[i] = m2._id;
        
        //Matches.update({_id:m1._id},{$set:{time:t2}});
      })
      
     for (i=0;i<iM1.length;i++){
        console.log(iM1[i],t1,'switching to', t2); 
        Matches.update({_id:iM1[i]},{$set:{time:t2}});
     }
     for (i=0;i<iM2.length;i++){
        console.log(iM2[i],t2,'switching to', t1); 
        Matches.update({_id:iM2[i]},{$set:{time:t1}});
     }  
      
     
    }
});

Template.activity.helpers({
  mediacount: function(matchID){
        return Media.find({'data.matchID':matchID,'data.event':Session.get("currentevent")}).count()
  },
  getteam: function(def){
    var r = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:def});
    return r.members
  },
  isVideo: function(){
    return this.result.mimetype && "video/quicktime"
  },
  cupinfo: function () {
      var year = Session.get("selectedYear");
    return Cups.findOne({year:parseInt(year),event:Session.get("currentevent")}); 
},
  isholeselected: function (h){
    return parseInt(Session.get("scorekeepinghole")) == parseInt(h) 
  },
  holesarray: function(){
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  },  
  getteamcolors: function(defending){
    var year = Session.get("selectedYear");
    var r = Rosters.findOne({year:year,defending:defending,event:Session.get("currentevent")});
      //console.log(r);
    return r.color[0]
  },  
  showscoringpane: function(){
    return Session.get('showscoringpane')
  },
  iscurrentUser: function(){
    return (Meteor.user() !== 'undefined')
  },
  firstName: function() {
    return this.userName.split(' ')[0];
  },
  recipeTitle: function() {
    return RecipesData[this.recipeName].title;
  },
  path: function() {
    return Router.path('recipe', { name: this.recipeName },
      { query: { activityId: this._id } })
  },
  hasmatchstarted: function (matchID) {
     var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); 
     if (y.hole>0){return 1}
     else {return 0}
},
  getholeresult: function (holenum, matchID){
      var T1 = Rosters.findOne({year:parseInt(matchID/100)+2000,defending:1,event:Session.get("currentevent")});
      var T2 = Rosters.findOne({year:parseInt(matchID/100)+2000,defending:0,event:Session.get("currentevent")});
      var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")}); var result;
      //cursor.forEach(function(x){result = x.result[holenum-1];})
      cursor.forEach(function(x){result = eval('x.holes.h'+holenum+'.result')}) //JTS change jan17
      switch (result){
        case 1:
           //out = "<img src=\"/img/flags/" +T1+ "/"+T1+"_tiny.png\">";
             out = T1.color[0];
        break;
        case -1:
           //out = "<img src=\"/img/flags/" +T2+ "/"+T2+"_tiny.png\">";  
             out = T2.color[0];
        break;
        case 0:
           //out = "P";
             out = "rgb(200,200,200)"; 
        break;
        case 2:
           //out = ""; 
             out = "white";  
        break;
      }
      return out;
  },
  getholeresult2: function (holenum, matchID){
      var cursor = Cups.find({year:parseInt(matchID/100)+2000,event:Session.get("currentevent")}); var T1; var T2;
      cursor.forEach(function(x){T1 = x.T1; T2 = x.T2;})
      var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")}); var result;
      cursor.forEach(function(x){result = x.result[holenum-1];})
      switch (result){
        case 1:
           out = "<img src=\"/img/app/" +T1+ "_icon.png\">"; 
        break;
        case -1:
           out = "<img src=\"/img/app/" +T2+ "_icon.png\">";      
        break;
        case 0:
           out = "P";      
        break;
        case 2:
           out = "";      
        break;
      }
      return out;
  },
  matchesEditable: function(){
     return isAdmin() & Session.get('matchaccess');
  },
  getmatchhole: function (matchID) {
      var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get("currentevent")})
    // determine number of match holes by whether or not that format gives points on the back nine.
    if (eval('c.formats.'+this.type+'.points[1]')>0){var nHoles =18;} else {var nHoles = 9;}
      
      var out;
      var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
      out = "thru ".concat(y.hole);
      if (y.status==0){out="AS ".concat(out);}
      if (Math.abs(y.status)>(nHoles-y.hole) || y.hole == nHoles){out="F";
                    if (Math.abs(y.status)==0 & y.hole == nHoles){out="AS, F";}}
      return out;      
},gT1: function(){
      var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')})
  },
  gT2: function(){
    var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')})
  },
  getscorekeepinghole: function(){
    var out = Session.get("scorekeepinghole");
    return out
  },
  getleadteam: function(matchID,param){
      var year = 2000+parseInt(matchID/100); var T1; var T2; var status; var leadteam; var out;
      var cupinfo = Cups.find({year:year,event:Session.get("currentevent")}); cupinfo.forEach(function(x){T1=x.T1;T2=x.T2;})
      var matchinfo = Matches.find({matchID:matchID,event:Session.get("currentevent")}); matchinfo.forEach(function(x){status=x.status;})
      leadteam = null;
      if (status>0){leadteam = Rosters.find({year:year,description:T1,event:Session.get("currentevent")});}
      if (status<0){leadteam = Rosters.find({year:year,description:T2,event:Session.get("currentevent")});}
      
      if (leadteam == null){out = "rgb(240,240,240)"}
      else{
      var cursor = leadteam.forEach(function(x){
        switch (param){
        case "color":
            out = rgb2rgba(x.color[0],0.8);   break;
        case "captain":
            out = x.captain; break;      
      }
      })
      }
      return out
  }
    
})
