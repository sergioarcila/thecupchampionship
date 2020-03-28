
Template.wager.helpers({
    getmatch: function(matchID){
    return Matches.find({matchID:{$in:matchID},event:Session.get('currentevent')})
},
    hasmatchstarted: function (matchID) {
     var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); 
     if (y.hole>0){return 1}
     else {return 0}
    },
    compare2: function(picks,idx){
        return picks[idx]>0
    },
    getmatchstatus2: function (matchID, teamflag,idx){
    //this returns the status of a match as a string, if the team is winning
    //if it hasn't started (hole 0), then it prints the odds
    teamflag = teamflag[idx];
    var x = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); var out;
        var status = x.status*teamflag; console.log(teamflag);
        switch (x.hole){
            case 0: //if it hasn't started, print the time
                out = x.time;
                break;
            default:
              if (Math.abs(status)>(18-x.hole) & x.hole<18){out=Math.abs(status) + " & " + (18-x.hole);
                                                            if (status>0){out = "W, "+out;}
                                                            else {out = "L, "+out;}
                                                           } //if its over
              else if (x.hole==18){
                                    if (status>0){out = "W, "+Math.abs(status)+" UP";}
                                    else {         out = "L, "+Math.abs(status)+" UP";}
                                  }
              else {out=Math.abs(x.status) + " UP thru " + x.hole;} //if its ongoing        
       }
    
    return out
  }
    
})

Template.wager.events({
    'click #confirm': function(event){
        Wagers.update({_id:this._id},{$set:{'info.confirmed':true}})
    }
})