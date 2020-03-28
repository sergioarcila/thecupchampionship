
Template.activity2.events({
  'click .js-match': function() {
    Overlay.open('overlaymatch', this);
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
    'click .js-match': function() {
    if (!isAdmin() || !Session.get('matchaccess')){Overlay.open('overlaymatch', this);}
    //Session.set('showscoringpane',!Session.get('showscoringpane')); 
  },
    'change .holeresult': function(){
    var matchID = this.matchID; 
    if (eval('holeresult'+matchID+'.value') !== ""){
    var y = Matches.findOne({matchID:matchID}); var result = y.result; 
        result[Session.get("scorekeepinghole")-1] = eval('holeresult'+matchID+'.value');
        Matches.update({_id:this._id},{$set:{result:result}});
    if (this.handicap) {
        var net = y.net;
        if (eval('holeresult'+matchID+'.value') == "N"){adjust = "N";}
        else {var adjust = getNET(this.index,this.course,Session.get("scorekeepinghole"),eval('holeresult'+matchID+'.value'));}
        net[Session.get("scorekeepinghole")-1] = adjust;
        Matches.update({_id:this._id},{$set:{net:net}});
    }
    updatestroke(matchID);
    snapshot(y._id);
    eval('holeresult'+matchID+'.value = \"\"');
    }
}
    
});

Template.activity2.helpers({
    mediacount: function(matchID){
        return Media.find({'data.matchID':matchID,'data.event':Session.get("currentevent")}).count()
  },
  cupinfo: function () {
      var year = Session.get("selectedYear")-1;
    return Cups.findOne({year:parseInt(year),event:Session.get('currentevent')}); 
},
 memberteam: function (name){
     var y = Rosters.findOne({year:2016, members:{$in:[name]}});
     return y.description
 },
getmember: function(){
    var name = this.T1[0];
    var m = Members.findOne({name:name,event:Session.get('currentevent')});
    return m
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
  matchover: function(matchID){
  var y = Matches.findOne({matchID:matchID});
      if (y.hole > 17) {return true}
        else {return false}
  },   
  isT1: function(member){
    var year = Session.get("selectedYear")-1;
    var r = Rosters.findOne({year:year,members:{$in:[member]},event:Session.get("currentevent")});
    return r.defending
  },   
  getteamcolors: function(defending){
    var year = Session.get("selectedYear")-1;
    var r = Rosters.findOne({year:year,defending:defending,event:Session.get("currentevent")});
    return r.color[0]
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
          if (y.result[i]=="N") {}
          else {
          total = total + parseInt(y.result[i]);
          }
      }
      
      return total
  },
  total18G: function(matchID){
      var y = Matches.findOne({matchID:matchID}); 
      var total = 0;
      for (var i=0; i<18; i++){
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
          if (y.result[i]=="N") {break;}
          total = total + parseInt(y.net[i]);
      }
      
      return total
  },
  total18N: function(matchID){
      var y = Matches.findOne({matchID:matchID}); 
      var total = 0;
      for (var i=0; i<18; i++){
          if (y.result[i]=="N") {break;}
          total = total + parseInt(y.net[i]);
      }
      return total
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
  },
  isteammatch: function (matchID) {
    var cursor = Matches.find({matchID:matchID});var type; var out;
      cursor.forEach(function(x){
        if (x.type == "shamble" || x.type == "bestball"){out=1;}
      })
      return out
  },
  isscorekeeper: function (matchID){
      var screenName = Meteor.user().services.twitter.screenName;
      var cursor = Matches.find({matchID:matchID}); var scorekeepers;
      cursor.forEach(function(x){scorekeepers = x.access;})
      if (screenName == "TheCupKY"){out = 1;}
      return out
  },
  hasmatchstarted: function (matchID) {
     var y = Matches.findOne({matchID:matchID}); 
     if (y.hole>0){return 1}
     else {return 0}
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
  getpar: function(holenum,course) {
      var x = Exhibitions.findOne({_id:Session.get('selectedExhibition')})
      var y = Courses.findOne({description:x.course})
      return y.par[holenum-1]
  },
  gethandicap: function(holenum,course) {
      var x = Exhibitions.findOne({_id:Session.get('selectedExhibition')})
      var y = Courses.findOne({description:x.course})
      return y.handicap[holenum-1]
  },
  getholeresult2: function (holenum, matchID){
      var cursor = Cups.find({year:parseInt(matchID/100)+2000}); var T1; var T2;
      cursor.forEach(function(x){T1 = x.T1; T2 = x.T2;})
      var cursor = Matches.find({matchID:matchID}); var result;
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
  getmatchhole: function (matchID) {
      var y = Matches.findOne({matchID:matchID});
      out = "thru ".concat(y.hole);
      if (y.hole == 18) {out = "F"}
      return out
},
  getmatchstatus: function (matchID, teamflag){
    var cursor = Matches.find({matchID:matchID}); var out;
      cursor.forEach(function(x){
        switch (x.hole){
            case 0: //if it hasn't started, print the odds
                out = x.T1odds;
                if (teamflag<0) {out=x.T2odds;}
                break;
            default:
            if (x.status*teamflag > 0){//only bother if they are winning
              if (Math.abs(x.status)>(18-x.hole) & x.hole<18){out=Math.abs(x.status) + " & " + (18-x.hole);} //if its over
              else {out=Math.abs(x.status) + " UP";} //if its ongoing
          
            } else {out = "";}  
        
       }  
      })
    return out
  },
  getscorekeepinghole: function(){
    var out = Session.get("scorekeepinghole");
    return out
  },
  getlastteam: function(name){
    return Rosters.find({members:{$in:[name]}},{sort:{year:-1},limit:1})
  },    
  getleadteam: function(matchID,param){
      var year = 2000+parseInt(matchID/100); var T1; var T2; var status; var leadteam; var out;
      var cupinfo = Cups.find({year:year}); cupinfo.forEach(function(x){T1=x.T1;T2=x.T2;})
      var matchinfo = Matches.find({matchID:matchID}); matchinfo.forEach(function(x){status=x.status;})
      leadteam = null;
      if (status>0){leadteam = Rosters.find({year:year,description:T1});}
      if (status<0){leadteam = Rosters.find({year:year,description:T2});}
      
      if (leadteam == null){out = "rgb(100,100,100)"}
      else{
      var cursor = leadteam.forEach(function(x){
        switch (param){
        case "color":
            out = x.color[0]; break;
        case "captain":
            out = x.captain; break;
      }
      })
      }
      return out
  },
  isAdmin: function() {
    return Meteor.user() && Meteor.user().admin;
  }
    
})
