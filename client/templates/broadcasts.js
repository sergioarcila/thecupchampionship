Template.broadcasts.helpers({
    gT1: function(){
        var r = Rosters.findOne({year:Session.get('selectedYear'),defending:1,event:Session.get('currentevent')},{code:1});
    return r
  },
  gT2: function(){
    var r = Rosters.findOne({year:Session.get('selectedYear'),defending:0,event:Session.get('currentevent')},{code:1});
    return r
  },
    getmatchsnapshot: function(hole,matchID){
      if (!hole){ var r =  History.findOne({event:Session.get('currentevent')},{sort:{'time':1}});}
    if (hole > 18) {var r =  History.findOne({event:Session.get('currentevent')},{sort:{'time':-1}});}
    else {
      var r =  History.findOne({matchID:matchID,match_hole:hole,event:Session.get('currentevent')});
    }
      //console.log("grabbed",r.matchID,'from hole:',r.match_hole,'id',r._id);
      return r
      
  }
    })

Template.broadcasts.events = ({
 'click .js-match': function(event){
    var idx = Session.get('videoloop').IDs.indexOf(this._id);
    var loop = Session.get('videoloop'); loop.index = idx;
    Session.set('videoloop', loop);
     var m = Media.findOne({'_id':Session.get('videoloop').IDs[Session.get('videoloop').index]});    
     Overlay.open('fileOverlay',m);
 }
})