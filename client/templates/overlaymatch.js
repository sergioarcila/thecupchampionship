var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';


Template.overlaymatch.onCreated(function() {
  Session.set(TWEETING_KEY, true);
  Session.set(IMAGE_KEY, null);
    //console.log(this.data.T1,this.data.T2);
    //var members = this.data.T1.concat(this.data.T2);
    //var ready = this.subscribe('members',{event:Session.get("currentevent"),name:members});
});

Template.overlaymatch.helpers({
  attachedImage: function() {
    return Session.get(IMAGE_KEY);
  },
  onTeam: function(def){
    var r = Rosters.findOne({defending:def,year:Session.get('selectedYear'),event:Session.get('currentevent'),members:{$in:[Meteor.user().profile.name]}})
    return (typeof r !== 'undefined')
  },
  T1: function(){
      var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')})
  },
  T2: function(){
    var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')})
  },
  hasBet: function(){
    var m = Wagers.findOne({matchID:this.matchID, event:Session.get('currentevent'), name:Meteor.user().profile.name});
    return m == 'undefined'
  },  
  avatar: function() {
    return Meteor.user().services.twitter.profile_image_url_https;
  },
 getcup: function(){
    return Cups.find({year:parseInt(Session.get("selectedYear"))}); 
 },
 getpar: function(matchID,holenum) {
      var x = Matches.findOne({matchID:matchID}); 
      var y = Courses.findOne({description:x.course})
      return y.par[holenum-1]
  },
    isholeselected: function (h){
    return parseInt(Session.get("scorekeepinghole")) == parseInt(h) 
  },
    getholeresult: function (holenum, matchID){
      if (matchID > 0){
        
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
          
      }
      else {
      
          var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")}); var result;
      //cursor.forEach(function(x){result = x.result[holenum-1];})
      cursor.forEach(function(x){result = eval('x.holes.h'+holenum+'.result')}) //JTS change jan17
      switch (result){
        case 1:
           //out = "<img src=\"/img/flags/" +T1+ "/"+T1+"_tiny.png\">";
             out = "rgb(255,0,0)";
        break;
        case -1:
           //out = "<img src=\"/img/flags/" +T2+ "/"+T2+"_tiny.png\">";  
             out = "rgb(0,0,255)";
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
      
      }
  },
    getholeresult2: function (holenum, matchID){
      var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
      if (m.type !== 'stroke'){
          
        var T1 = Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get("currentevent")});
        var T2 = Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get("currentevent")});
          
       var result;
      switch (eval('m.holes.h'+holenum+'.result')){
        case 1:
           //out = "<img src=\"/img/flags/" +T1+ "/"+T1+"_tiny.png\">";
             out = {flag:true, code:T1.code, result:null};
        break;
        case -1:
           //out = "<img src=\"/img/flags/" +T2+ "/"+T2+"_tiny.png\">";  
             out = {flag:true, code:T2.code, result:null};
        break;
        case 0:
           //out = "P";
             out = {flag:false, code:null, result:"P"}; 
        break;
        case 2:
           //out = ""; 
             out = {flag:false, code:null, result:""};  
        break;
      }
      return out;
          
      }
      else {
      
          var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")}); var result;
      //cursor.forEach(function(x){result = x.result[holenum-1];})
      cursor.forEach(function(x){result = eval('x.holes.h'+holenum+'.result')}) //JTS change jan17
      switch (result){
        case 1:
           //out = "<img src=\"/img/flags/" +T1+ "/"+T1+"_tiny.png\">";
             out = "rgb(255,0,0)";
        break;
        case -1:
           //out = "<img src=\"/img/flags/" +T2+ "/"+T2+"_tiny.png\">";  
             out = "rgb(0,0,255)";
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
      
      }
  },
    frontnine: function(){
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
    allmatches: function(time){
        var m = Matches.find({time:time,event:Session.get("currentevent")},{sort:{matchID:1}});
        var members = [];
        m.forEach(function(x){ members = members.concat(x.T1); members = members.concat(x.T2);})
        Meteor.subscribe('members',{event:Session.get("currentevent"),name:members}); 
    return m
    },
    backnine: function(){
    return [10,11,12,13,14,15,16,17,18]
  },
  
 getsastroke: function (matchID,hole){
    var y = Matches.findOne({matchID:matchID});
    var c = Courses.findOne({description:y.course});
    holehandicap = c.handicap[hole-1];
    if (y.index < 0) {var adjust = -1*(-1*y.index>=(19-holehandicap));} 
    if (y.index <= 18 & y.index>=0) {var adjust = 0+(y.index>=holehandicap);}
    if (y.index > 18) {var adjust = 1+((y.index-18)>=holehandicap);}
     
    if (adjust<0){return "h"} 
    else if (adjust==0){return ""}
    else if (adjust>0 & adjust<2){return "hc"}
    else if (adjust>=2){return "hcc"}
 },    
  getGROSSresult: function (holenum,matchID){
      var cursor = Matches.findOne({matchID:matchID});
      if (cursor.result[holenum-1] == "N"){return ""}
      else {return cursor.result[holenum-1]}
  },
  getNETresult: function (holenum,matchID){
      var cursor = Matches.findOne({matchID:matchID});
      if (cursor.net[holenum-1] == "N"){return ""}
      else {return cursor.net[holenum-1]}
  },
  total9G: function(matchID,side){
      var y = Matches.findOne({matchID:matchID}); 
      switch (side){
      case 0:
        var h1 = 0; var h2 = 9;
      break;
      case 1:
        var h1 = 9; var h2 = 18;
      break;
      }
      var total = 0;
      for (var i=h1; i<h2; i++){
          if (i>y.result.length-1){break;}
          else {
              if (y.result[i]=="N") {}
              else {
              total = total + parseInt(y.result[i]);
              }
          }
      }
      
      return total
  },
  total18G: function(matchID){
      var y = Matches.findOne({matchID:matchID}); 
      var total = 0;
      for (var i=0; i<y.result.length; i++){
          if (y.result[i]=="N") {}
          else {
          total = total + parseInt(y.result[i]);
          }
      }
      return total
  },
  total9N: function(matchID,side){
      var y = Matches.findOne({matchID:matchID}); 
      switch (side){
      case 0:
        var h1 = 0; var h2 = 9;
      break;
      case 1:
        var h1 = 9; var h2 = 18;
      break;
      }
      var total = 0;
      for (var i=h1; i<h2; i++){
          if (i>y.result.length-1){break;}
          else {
              if (y.result[i]=="N") {break;}
              total = total + parseInt(y.net[i]);
          }
      }
      
      return total
  },
  total18N: function(matchID){
      var y = Matches.findOne({matchID:matchID}); 
      var total = 0;
      for (var i=0; i<y.result.length; i++){
          //if (y.result[i]=="N") {break;}
          total = total + parseInt(y.net[i]);
      }
      return total
  },
    gT1: function(){
      var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')})
  },
  gT2: function(){
    var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')})
  },
  getmeanpower: function(names){
    var m  = Members.find({name:{$in:names}},{stats:1}); var pwr = 0; var i = 0;
      m.forEach(function(x){
          pwr = pwr + x.stats.power; i++;
          //console.log(x.name,x.stats.power);
      })
      return getNumber(pwr/i)
  },
  totalscore: function(matchID){
      var y = Matches.findOne({matchID:matchID}); 
      var total = [0,0];
      for (var i=0; i<18; i++){
          if (y.result[i] == "N") {}
          else {
          total[0] = total[0] + parseInt(y.result[i]);
          total[1] = total[1] + y.net[i];
          }
      }
      
      return total
  }
});

Template.overlaymatch.events({
  'change .holeresult': function(event){
    var score = event.target.value;
    var hole = Session.get('scorekeepinghole');
    //Matches.update({_id:this._id},{$set:{'result.\'+hole+\'':score}})
    console.log(score,hole);
    
    if (score !== ""){
    var y = Matches.findOne({_id:this._id}); var result = y.result; 
        if (score == "N"){result.splice(-1,1);}
        else {result[Session.get("scorekeepinghole")-1] = parseInt(score);}
        Matches.update({_id:this._id},{$set:{result:result}});
    if (this.handicap) {
        var net = y.net;
        if (score == "N"){net.splice(-1,1);console.log(net);}
        else {var adjust = getNET(this.index,this.course,Session.get("scorekeepinghole"),score);
                net[Session.get("scorekeepinghole")-1] = adjust;
             }
        Matches.update({_id:this._id},{$set:{net:net}});
    }
    Meteor.call('updatestroke',{matchID:this.matchID,event:Session.get('currentevent'),course:this.course});
        var location = Geolocation.currentLocation();
        if (location == null){location = {coords:[]}}   
    Meteor.call('snapshot',{type:this.type,matchID:this.matchID, time: new Date(), event:Session.get('currentevent'),user:Meteor.user(),latlong:[location.coords.latitude,location.coords.longitude,location.coords.accuracy]});
    }
    
    document.getElementById('holeresult'+this.matchID).value = '';
  },
  'click .js-share': function() {
    Meteor.subscribe('media',Session.get('currentevent'),Session.get('selectedYear'));
    Overlay.open('shareOverlay', this);
  },
  'click .clickhole': function(event){
    Session.set('scorekeepinghole',parseInt(event.target.id));
  },
    'click .bet': function(event){
        var matchID = parseInt(event.target.id);
        if (document.getElementById("T1amount"+matchID) !== null)
            {var T1amount = parseInt(document.getElementById("T1amount"+matchID).value);}
        if (document.getElementById("T2amount"+matchID) !== null)
            {var T2amount = parseInt(document.getElementById("T2amount"+matchID).value);}
        
            var wagerinfo = {
                "matchID" : [], 
                "name" : "", 
                "event" : "", 
                "info" : {
                    "pick" : [], 
                    "spread" : 0.0, 
                    "odds" : [], 
                    "time" : "", 
                    "amount" : 0, 
                    "payout" : 0, 
                    "type" : "moneyline"
                }, 
                "result" : {
                    "status" : 0.0, 
                    "payout" : 0
                }
            };
        console.log(T1amount + " " + T2amount);
        var m = Matches.findOne({matchID:matchID,event:Session.get('currentevent')});
        
        var w = Wagers.findOne({matchID:m.matchID,name:Meteor.user().profile.name});
        if (w !== undefined) {alert('You have already wagered on this match')}
        else {
        wagerinfo.matchID[wagerinfo.matchID.length] = matchID;
        wagerinfo.name = Meteor.user().profile.name;
        wagerinfo.event = Session.get('currentevent');
        wagerinfo.info.spread = "";
        wagerinfo.info.time = new Date;
        wagerinfo.info.confirmed = false;
        
        if (T1amount){
            if (m.T1odds == 'EVEN'){m.T1odds=-100;}
            wagerinfo.info.odds[wagerinfo.info.odds.length] = m.T1odds;
            wagerinfo.info.pick[wagerinfo.info.pick.length] = 1;
            wagerinfo.info.amount = T1amount;
            if (m.T1odds>0){wagerinfo.info.payout = T1amount + T1amount/(100/m.T1odds);}
            if (m.T1odds<0){wagerinfo.info.payout = T1amount + T1amount*(100/Math.abs(m.T1odds));}
        }
        if (T2amount){
             if (m.T2odds == 'EVEN'){m.T2odds=-100;}
            wagerinfo.info.odds[wagerinfo.info.odds.length] = m.T2odds;
            wagerinfo.info.pick[wagerinfo.info.pick.length] = -1;
            wagerinfo.info.amount = T2amount;
            if (m.T2odds>0){wagerinfo.info.payout = T2amount + T2amount/(100/m.T2odds);}
            if (m.T2odds<0){wagerinfo.info.payout = T2amount + T2amount*(100/Math.abs(m.T2odds));}
        }
        Wagers.insert(wagerinfo);
        Router.go('/wagers');
        Overlay.close();
        alert('Be sure to click CONFIRM on your bet to finalize');
        }
    },
     'click .holeup': function(event,template){
        var currhole = Session.get("scorekeepinghole");
        var nexthole = currhole+1;
        if (nexthole > 18){nexthole=18;}
        Session.set("scorekeepinghole",nexthole);
},
    'click .holedown': function(event,template){
        var currhole = Session.get("scorekeepinghole");
        var nexthole = currhole-1;
        if (nexthole < 1){nexthole=1;}
        Session.set("scorekeepinghole",nexthole);
},
    'click .holechange': function(event,template){
        //simulatecup(this.matchID);
        //Quickly update the hole result
        //console.log(event.target.id);
        Session.set('scriptrunning', true);
        //Quickly update the hole result
        var matchID = this.matchID;
        var id = this._id; var type = this.type;
        var currhole = Session.get("scorekeepinghole");
        var result = parseInt(event.target.id);
        eval('Matches.update({_id:id},{$set:{\'holes.h'+currhole+'.result\':'+result+'}});'); //jtsjan17
        
        //CLIENT
        updatematch(matchID,'status');
        
        var location = Geolocation.currentLocation();
        if (location == null){location = {coords:[]}}    
        Meteor.call('snapshot',{type:type,matchID:matchID, time: new Date(), event:Session.get('currentevent'), user:Meteor.user(),latlong:[location.coords.latitude,location.coords.longitude,location.coords.accuracy]});
        
        //SERVER
        if (matchID > 0){ // don't update exhibitions
        //Meteor.call('updatematch',{matchID:matchID,event:Session.get("currentevent")},['points']);
        updatematch(matchID,'points');    
        Meteor.call('updatecup', {matchID:matchID,event:Session.get("currentevent")},['leads']);
        }
        if (result<2 & (currhole+1 < 19)) {Session.set("scorekeepinghole",currhole+1)};
        if (result==2 & currhole > 1) {Session.set("scorekeepinghole",currhole-1)};
        Session.set('scriptrunning', false);
},
  'click .sim': function(event,template){
    simulatematch(this.matchID);    
  },
   'click .reset': function(event,template){
    resetmatch(this.matchID);    
  },
  'click #wagerlogin': function() {
    Overlay.open('overlayadmin');
  },
    
});
