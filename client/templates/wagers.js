var FEATURED_COUNT = 4;

Template.wagers.onCreated( function(){
    this.subscribe('matches',{name:'all',event:Session.get('currentevent'),year:Session.get('selectedYear')});
    if (isAdmin()){
        this.subscribe('wagers',{event:Session.get('currentevent'),year:Session.get('selectedYear')});
    } else {
        this.subscribe('wagers',{name:Meteor.user(),event:Session.get('currentevent'),year:Session.get('selectedYear')});
    }
})

Template.wagers.events({
    'change .currentexhibition': function(){
    var year = currentexhibition.value; // could be the P or a child element
    Session.set('selectedExhibition',year);
    },
    'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  },
    'click .js-question': function() {
    Overlay.open('overlay2', Exhibitions.findOne({_id:Session.get('selectedExhibition')}));
  }
    
});


Template.wagers.helpers({
    T1: function(){
      var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')})
  },
  T2: function(){
      var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    return Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')})
  },  
  getwagersummary: function() {
      var result = {    bets:0,overall:0,owed:0,owe:0,live:0,livepay:0,
                    T1:{bets:0,overall:0,owed:0,live:0},
                    T2:{bets:0,overall:0,owed:0,live:0}
                   };
      var yridx = 100*(Session.get('selectedYear')-2000)
      
        var w = Wagers.find({matchID:{$gt:yridx,$lt:yridx+100}});
        w.forEach(function(ww){
            result.bets++; result.overall += ww.info.amount;
            if (!ww.result.status & ww.result.payout){
                result.owed += ww.info.amount;
            }  
            else if (!ww.result.status & !ww.result.payout){result.owe += ww.info.amount;}
            else if (ww.result.status){result.live += ww.info.amount; result.livepay += ww.info.payout;}
        })
      
      return result
  },
  getwagers: function (){
    var yridx = parseInt(Session.get('selectedYear')-2000)*100;
    if (isAdmin()){
        return Wagers.find({event:Session.get('currentevent'), matchID:{$gt:yridx,$lt:yridx+100}},{sort:{matchID:1}});  
    } else {
        return Wagers.find({name:Meteor.user().profile.name,event:Session.get('currentevent'), matchID:{$gt:yridx,$lt:yridx+100}},{sort:{matchID:1}});  
    }
      
      
  },
  
  ismatchpopulated: function (matchID) { //need to fix
      var x = Matches.findOne({matchID:matchID}); var P11 = " " + x.P11; var P12 = " " + x.P12; var P21 = " " + x.P21; var P22 = " " + x.P22;
      var n = parseInt(P11[P11.length-1]+P12[P12.length-1]+P21[P21.length-1]+P22[P22.length-1]); 
      if (isNaN(n)) {return 1;}
      else {return 0}
  }
});