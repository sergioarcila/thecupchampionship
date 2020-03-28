Template.keymatch.events({
 
});

Template.keymatch.helpers({
  cupinfo: function () {
      var year = Session.get("selectedYear");
    return Cups.findOne({year:parseInt(year),event:Session.get("currentevent")}); 
},
  gettotalpoints: function (name){
    var m = Members.findOne({name:name});
    return m.singlespoints.y2016+m.shamblepoints.y2016+m.bestballpoints.y2016;  
  },
  getavailpoints: function (name){
    var m = Members.findOne({name:name});
    return m.ptsavailable.y2016.singles+m.ptsavailable.y2016.bestball+m.ptsavailable.y2016.shamble;  
  },
  getplayerteam: function (name){
    var m = Rosters.findOne({year:2016, members:{$in:[name]}});
    return m.description;
  },
  getteam: function(defending){
    var year = Session.get("selectedYear");
    return Rosters.findOne({year:year,defending:defending,event:Session.get("currentevent")})
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
      cursor.forEach(function(x){result = x.result[holenum-1];})
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
  getmatchhole: function (matchID) {
      var out;
      var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
      out = "thru ".concat(y.hole);
      if (y.status==0){out="AS ".concat(out);}
      if (Math.abs(y.status)>(18-y.hole) || y.hole == 18){out="F";
                    if (Math.abs(y.status)==0 & y.hole == 18){out="AS, F";}}
      return out;
},
  getmatchstatus: function (matchID, teamflag){
    var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")}); var out;
      cursor.forEach(function(x){
        switch (x.hole){
            case 0: //if it hasn't started, print the odds
                out = x.T1odds;
                if (teamflag<0) {out=x.T2odds;}
                    if (out>0) {out = getNumber(out)}; //if its a number, format it
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
  getleadteam: function(matchID,param){
      var year = 2000+parseInt(matchID/100); var T1; var T2; var status; var leadteam; var out;
      var cupinfo = Cups.find({year:year,event:Session.get("currentevent")}); cupinfo.forEach(function(x){T1=x.T1;T2=x.T2;})
      var matchinfo = Matches.find({matchID:matchID,event:Session.get("currentevent")}); matchinfo.forEach(function(x){status=x.status;})
      leadteam = null;
      if (status>0){leadteam = Rosters.find({year:year,description:T1,event:Session.get("currentevent")});}
      if (status<0){leadteam = Rosters.find({year:year,description:T2,event:Session.get("currentevent")});}
      
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
  }
    
})
