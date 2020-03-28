var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';
var fs = require('fs');

Template.fileOverlay.onCreated(function(window) {
    let template = Template.instance();  
    if (Session.get('videoloop').type == 'cup' || Session.get('videoloop').type == 'match'){
        template.subscribe('history', {event:Session.get('currentevent'),year:Session.get('selectedYear')});
    }
    else {
        var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')})
        var unique = e.unique+(Session.get('selectedYear')-2000);
        template.subscribe('history', {event:Session.get('currentevent'),year:unique});
    }
    
});

Template.fileOverlay.events({
'ended video': function(){
    var video = document.getElementById("example_video_1");
    
    var videoinfo = Session.get('videoloop');
    if (videoinfo.index<(videoinfo.IDs.length-1)){
        var m = Media.findOne({_id:videoinfo.IDs[videoinfo.index+1]});
        var e = Events.findOne({description:Session.get('currentevent')});
        
        
        var t = ((videoinfo.index+1) % e.media.transition.freq) == 0;
            if (t){
                $("#transitionscreen").fadeIn(500);
                $("#matchscoring").fadeOut(500);  
                var matchscoring = document.getElementById("matchscoring");
                var cupscoring = document.getElementById("bummary");
                if (Session.get('videoloop').type == 'cup'){var cup = true;}
                if (cup) {$("#bummary").fadeIn(1000);}
                var logo = document.getElementById("cuplogo");
                matchscoring.style.top = '10px';
                cupscoring.style.bottom = '5px';
                logo.style.bottom = '10px';
                var interval = setInterval(foo, t*e.media.transition.time, m,videoinfo,video); var b = 0;
            }
            else {
                var interval = setInterval(foo, t*e.media.transition.time, m,videoinfo,video); var b = 0;
            }
        
        function foo(m,videoinfo,video) {
        //do nothing
            if (b>0){
                Overlay.close();
                if (m.result.overlay_url !== undefined){var url = m.result.overlay_url;}
                else {var url = m.result.url}
                video.setAttribute("src", m.result.url);
                Overlay.open('fileOverlay', m);
                video.play();
                $("#transitionscreen").fadeOut(250);
                $("#matchscoring").fadeIn(500); 
                Session.set('videoloop',{IDs:videoinfo.IDs,index:videoinfo.index+1,type:Session.get('videoloop').type});
                var videoinfo = Session.get('videoloop');
                
                console.log('Playing video ' + (videoinfo.index) + ' of ' + videoinfo.IDs.length);
                
                console.log(m);
                clearInterval(interval);
            }
            
        
            b++;
        }
        
    }
    else {
        var m = Media.findOne({_id:videoinfo.IDs[videoinfo.index]});
        var e = Events.findOne({description:Session.get('currentevent')});
        Overlay.close();
        Overlay.open('fileOverlay', {type:'end',day:m.data.day});
        $("#transitionscreen").fadeIn(500);
        $("#matchscoring").fadeOut(500); 
        if (Session.get('videoloop').type == 'cup'){var cup = true;}
        if (cup) {$("#bummary").fadeIn(1000);}
        
            var matchscoring = document.getElementById("matchscoring");
            var cupscoring = document.getElementById("bummary");
            var logo = document.getElementById("cuplogo");
            matchscoring.style.top = '10px';
            cupscoring.style.bottom = '5px';
            logo.style.bottom = '10px';
    }
   
}, 
'mouseenter video': function(event,template){
    event.currentTarget.controls = true;
},
'loadeddata video':function(){
    if (Session.get('videoloop').type == 'cup'){var cup = true;}
    var video = document.getElementById("example_video_1");
    var matchscoring = document.getElementById("matchscoring");
    var cupscoring = document.getElementById("bummary");
    if (cup) {$("#bummary").fadeIn(1000);}
    var logo = document.getElementById("cuplogo");
    $("#matchscoring").fadeIn(500);
   
    if (video.videoHeight < $(document).height()){
        matchscoring.style.top = (($(document).height() - video.videoHeight)/2+10) + 'px';
        cupscoring.style.bottom = (($(document).height() - video.videoHeight)/2+10)  + 'px';
        cupscoring.style.right = (($(document).width() - video.videoWidth)+5)  + 'px';
        logo.style.bottom = ($(document).height() - video.videoHeight)/2 + 'px';
    }
    else {
        matchscoring.style.top = '10px';
        cupscoring.style.bottom = '45px';
        logo.style.bottom = '10px';
    }
    if (this.data.matchID){
        $(".box-6").delay(1000).fadeIn(1000);
        $(".box-6").delay(3000).fadeOut(1000);
    }
}
   
})

Template.fileOverlay.rendered = function(){
    
}


Template.fileOverlay.helpers({
  getmatchsnapshot: function(hole,matchID){
    var h = History.findOne({matchID:matchID, match_hole:{$lt:hole},event:Session.get('currentevent')},{sort:{match_hole:-1}});
      //console.log(h,hole,matchID)
      return h
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
    getplayerteam: function(name){
    return Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),members:name});
},
  getcolor: function(d){
    var r = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:d})
    return r.color[0]
  },  
  cupinfo: function(){
    return Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')})
  },
  getmatchhole: function(h,status){
    if (Math.abs(status)>(18-h) || h == 18){return "F";}
    else {return h}
  },
  getviddate: function(d){
    var s = d.getHours();
    if (d.getMinutes() < 10) {
        s = s + ":0" + d.getMinutes();
    } else {s = s + ":" + d.getMinutes();}  
      
     return s 
  },
  isin: function(m,t){
    return t.indexOf(m)+1
  },
  gethistory: function(matchID,hole){
    if (!hole){ var r =  History.findOne({event:Session.get('currentevent')},{sort:{'time':1}});}
    if (hole > 18) {var r =  History.findOne({event:Session.get('currentevent')},{sort:{'time':-1}});}
    else {
      var r =  History.findOne({matchID:matchID,match_hole:hole,event:Session.get('currentevent')});
    }
      //console.log("grabbed",r.matchID,'from hole:',r.match_hole,'id',r._id);
      return r
  },
getcardinal: function(number) {
      number = parseInt(number);
    //console.log('jts is',number);
    if (number == 1){return '1st';}
    if (number == 2){return '2nd';}
    if (number == 3){return '3rd';}
    if (number > 3) {return number+'th'}
},  
  T1: function(){
     var r = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:1});
    return r
  },
  T2: function(){
    return Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:0})
  },
  getyardage: function(h){
    var c = Courses.findOne({description:this.data.course});
    return c.yardage[h-1];
  }
});

