Template.broadcastpreview.onCreated(function() {
        this.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
        this.subscribe('rosters',Session.get("currentevent"));
        this.subscribe('history', {event:Session.get('currentevent'),year:Session.get('selectedYear')})
        this.subscribe('matches', {event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'})
});


Template.broadcastpreview.events({
    'click .printsummary2': function(){
    var videoinfo = Session.get('videoloop');
    var broadcastdoc = Media.findOne({type:'broadcast', year:Session.get('selectedYear')}); 
    Media.update(broadcastdoc._id,{$set:{broadcastarray:[]}});
    console.log(videoinfo); i=0;
        var C = Cups.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var r1 = Rosters.findOne({description:C.T1,event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var r2 = Rosters.findOne({description:C.T2,event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var m; var h; var c; var IDs; var jsondoc; var matchhistories; var type;
    videoinfo.IDs.forEach(function(V){
        var type = 'video';
        
        m = Media.findOne({_id:V});
        if (m !== undefined) {
            h = History.findOne({matchID:m.data.matchID,match_hole:{$lt:m.info.hole},event:Session.get('currentevent')},{sort:{match_hole:-1,time:-1}})
            c = Courses.findOne({description:m.data.course});
        }
        else {
                c = null;
        }
            if (m.info.hole<2)  {h = History.findOne({event:Session.get('currentevent')},{sort:{'time':1}})}
            if (m.info.hole>18) {h = History.findOne({event:Session.get('currentevent')},{sort:{'time':-1}})}
            
        console.log(m);
        jsondoc = {data:m.data, info:m.info, result:m.result, history:h, course:c, type:type, T1:C.T1, T2:C.T2, T1c:r1.color, T2c:r2.color, time:h.time.getTime()};
        Media.update(broadcastdoc._id,{$push:{broadcastarray:jsondoc}});
        console.log(i + 'pushed ' + jsondoc.history.matchID);
        i++;
        
        if (i % 6 == 0) {
            type = "leaderboard"; 
            // take the last json info, find most recent history docs for all matches of that format on that day
            // find all matches of that format on that day
            var iyr=100*(Session.get('selectedYear')-2000);
            console.log(iyr + " " + m.data.day + " " + h.type);
            var match = Matches.find({matchID:{$gt:iyr,$lt:iyr+100}, day:m.data.day, type:h.type, event:Session.get('currentevent')},{sort:{hole:-1}});
            // looping over matches, log the IDs of the most recent history document for respctive matches
            IDs = []; matchhistories = []; 
            match.forEach(function(M){
                jsondoc2 = {};
                var h1 = History.findOne({matchID:M.matchID,event:Session.get('currentevent'), match_hole:{$lt:m.info.hole}}, {sort:{match_hole:-1, time:-1}});
                if (h1 == undefined) {
                    var h1 = History.findOne({matchID:M.matchID,event:Session.get('currentevent'), match_hole:{$lte:m.info.hole}}, {sort:{match_hole:-1, time:-1}});
                }
                console.log(M.matchID); console.log(h1.matchID);
                jsondoc2.histories = h1; 
                jsondoc2.match = M;
                matchhistories.push(jsondoc2);
            })
            
            jsondoc = {type:type,matchhistories:matchhistories};
            Media.update(broadcastdoc._id,{$push:{broadcastarray:jsondoc}});
            console.log(i + 'pushed leaderboard');
            i++;
        }
        
        
    })
    
    var type = "leaderboard"; 
            // take the last json info, find most recent history docs for all matches of that format on that day
            // find all matches of that format on that day
            var iyr=100*(Session.get('selectedYear')-2000);
            console.log(iyr + " " + m.data.day + " " + h.type);
            var match = Matches.find({matchID:{$gt:iyr,$lt:iyr+100}, day:m.data.day, type:h.type, event:Session.get('currentevent')},{sort:{hole:-1}});
            // looping over matches, log the IDs of the most recent history document for respctive matches
            var IDs = []; var matchhistories = []; 
            match.forEach(function(M){
                var jsondoc2 = {};
                //just pull the last history doc
                var h1 = History.findOne({matchID:M.matchID,event:Session.get('currentevent')}, {sort:{time:-1}});
                var h2 = History.findOne({event:Session.get('currentevent')}, {sort:{time:-1}});
                if (h1 == undefined) {
                    var h1 = History.findOne({matchID:M.matchID,event:Session.get('currentevent'), match_hole:{$lte:m.info.hole}}, {sort:{match_hole:-1, time:-1}});
                }
                h1.event_status = h2.event_status;
                console.log(M.matchID); console.log(h1.matchID);
                jsondoc2.histories = h1; 
                jsondoc2.match = M;
                matchhistories.push(jsondoc2);
            })
            
            jsondoc = {type:type,matchhistories:matchhistories};
            Media.update(broadcastdoc._id,{$push:{broadcastarray:jsondoc}});
            console.log(i + 'pushed leaderboard');
            i++;
    
    
},
'click .printsummary': function(){
    var videoinfo = Session.get('videoloop');
    var broadcastdoc = Media.findOne({type:'broadcast', year:Session.get('selectedYear')}); 
    Media.update(broadcastdoc._id,{$set:{broadcastarray:[]}});
    console.log(videoinfo); i=0;
        var C = Cups.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var r1 = Rosters.findOne({description:C.T1,event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var r2 = Rosters.findOne({description:C.T2,event:Session.get('currentevent'),year:Session.get('selectedYear')});
        var m; var h; var c; var IDs; var jsondoc; var matchhistories; var type;
    
    
            type = "leaderboard"; 
            // take the last json info, find most recent history docs for all matches of that format on that day
            // find all matches of that format on that day
            var iyr=100*(Session.get('selectedYear')-2000);
            var match = Matches.find({matchID:{$gt:iyr,$lt:iyr+100}, event:Session.get('currentevent')},{sort:{time:1}});
            // looping over matches
            IDs = []; matchhistories = []; 
            match.forEach(function(M){
                jsondoc2 = {};
                jsondoc2.match = M;
                matchhistories.push(jsondoc2);
            })
            
            jsondoc = {type:type,matchhistories:matchhistories};
            Media.update(broadcastdoc._id,{$set:{matches:jsondoc}});
               
    videoinfo.IDs.forEach(function(V){
        var type = 'video';
        
        m = Media.findOne({_id:V});
        if (m !== undefined) {
            h = History.findOne({matchID:m.data.matchID,match_hole:{$lt:m.info.hole},event:Session.get('currentevent')},{sort:{match_hole:-1,time:-1}})
            c = Courses.findOne({description:m.data.course});
        }
        else {
                c = null;
        }
            if (m.info.hole<2)  {h = History.findOne({event:Session.get('currentevent')},{sort:{'time':1}})}
            if (m.info.hole>18) {h = History.findOne({event:Session.get('currentevent')},{sort:{'time':-1}})}
            
        console.log(m);
        jsondoc = {data:m.data, info:m.info, result:m.result, history:h, course:c, type:type, T1:C.T1, T2:C.T2, T1c:r1.color, T2c:r2.color, time:h.time.getTime()};
        Media.update(broadcastdoc._id,{$push:{broadcastarray:jsondoc}});
        console.log('pushed ' + jsondoc.history.matchID);
        
    })
    
}
});

Template.broadcastpreview.helpers({

  broadcast: function(){
      return Media.find({_id:{$in:Session.get('videoloop').IDs}},{sort:{'data.day':1,'info.hole':1}})
  },
  
  getleaderboard: function(){
      //console.log(this); 
      var iyr=100*(Session.get('selectedYear')-2000);
      if (this.type !== 'end'){
      //takes in a MEDIA document, pushes out a HISTORY
      var H = this.info.hole; var matchID = this.data.matchID;
      //console.log(updated)
    
      if (Session.get('videoloop').type == 'cup'){
        var m = Matches.find({matchID:{$gt:iyr,$lt:iyr+100},day:this.data.day,event:Session.get('currentevent')},{sort:{hole:-1},limit:21});
      }
      else {
          var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
          var unique = (e.unique+(e.year-2000))
          var m = Matches.find({matchID:{$regex:unique},event:Session.get('currentevent')},{sort:{hole:-1}});
      }
    
      //explanation: Grabs the most recent history from this match, loops over all leaderboard matches, finding most recent history document for each, based on time
      var IDs = []; var h;
      var h1 = History.findOne({matchID:matchID,event:Session.get('currentevent'),match_hole:{$lte:H}},{sort:{match_hole:-1}});
      //console.log('history corresponding to this media is',h1.matchID);
      m.forEach(function(mm){
        h = History.findOne({matchID:mm.matchID,event:Session.get('currentevent'),time:{$lt:h1.time}},{sort:{time:-1}});
          //console.log('most recent history from looped match:',mm.matchID,h1);
          if (h!==undefined){IDs.push(h._id);}
      })
      //console.log(IDs);
      if (Session.get('videoloop').type == 'cup'){
          return History.find({_id:{$in:IDs}},{sort:{match_hole:-1}})
      } else {
          return History.find({_id:{$in:IDs}},{sort:{match_netstatus:-1}})
      }
    
      }
      else {
          console.log('reached end');
          switch (Session.get('videoloop').type){
            case 'cup': 
                
               var m = Matches.find({matchID:{$gt:iyr,$lt:iyr+100},day:this.day,event:Session.get('currentevent')},{sort:{hole:-1},limit:21});
               break;
            case 'exhibition':
               var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
               var unique = (e.unique+(e.year-2000));
               var m = Matches.find({matchID:{$regex:unique},event:Session.get('currentevent')},{sort:{hole:-1},limit:21});
               break;
            case 'match':
               break;
          }
                                 
               var IDs = []; var h;
               console.log('media over');
               m.forEach(function(mm){
                   console.log(mm.matchID);
               h = History.findOne({matchID:mm.matchID,event:Session.get('currentevent')},{sort:{match_hole:-1}});
               IDs.push(h._id);
               })
               //console.log(IDs);
               return History.find({_id:{$in:IDs}},{sort:{match_hole:-1}})                     
        } 
},
  getleaderboardmatch: function(){ //takes in a HISTORY document, pushes MATCH
        //console.log(this.matchID);
      return Matches.findOne({matchID:this.matchID,event:Session.get('currentevent')});
  },   
});
