var freshstat = {"draft" : {
                "perc" : 50, 
                "pos" : 1
            }, 
            "active" : 1, 
            "power" : 50, 
            "impact" : 0, 
            "bestball" : {
                "points" : 0, 
                "perc" : 50, 
                "avail" : 0
            }, 
            "singles" : {
                "points" : 0, 
                "perc" : 50, 
                "avail" : 0
            }, 
            "shamble" : {
                "points" : 0, 
                "perc" : 50, 
                "avail" : 0
            }, 
            "cuprecord" : 2, 
            "winperc" : 50 ,
            "ranking" : {
                "commish" : 1, 
                "picks" : [], 
                "confirmed" : false
            }     
            
        };


          

//import Exif from 'simple-exiftool'
 



Template.admin.onCreated(function(){
     
 this.subscribe('media');
 this.subscribe('members',{event:Session.get('currentevent'),name:'all'});    
 this.subscribe('matches',{event:Session.get('currentevent'),name:'all',year:0});  
this.subscribe('history',{event:Session.get('currentevent'),year:Session.get('selectedYear')});       
 var ready = this.subscribe('rosters',Session.get('currentevent'));                            
})

Template.admin.helpers({
  latestNews: function() {
    return News.latest();
  },
  getcups: function (){
    return Cups.find({event:Session.get('currentevent')},{sort:{year:-1}});  
  },
  iscurrentyear: function (year){
      var out = "";
    if (year == Session.get("selectedYear")){out = "selected";}
      return out
  },
  
  isptschange: function (ispan){
      if (ispan == Session.get('ptschange')){return "change"}
  },
  getusers: function(){
    return Meteor.users.find({},{sort:{createdAt:-1}});
  },    
  getmatches: function(){
      var matchID = 100*(Session.get("selectedYear")-2000);
      return Matches.find({matchID:{$gt:matchID,$lt:matchID+100},event:Session.get('currentevent')},{sort:{matchID:1}})
  },
  getmatch: function(){
      return Matches.findOne({_id:Session.get('selectedMatch')})
  },
  getmembers: function(){
    return eval('Members.find({\'active.y'+Session.get('selectedYear')+'\':1,event:Session.get(\'currentevent\')},{sort:{name:1}});');
  },
  getpointplayers: function(year){
      return eval('Members.find({active.y'+year+'\':1,event:Session.get(\'currentevent\')},{sort:{\'points.y'+year+'\':-1}})')
  },
  getcup: function(){
      return Cups.findOne({event:Session.get('currentevent'),year:parseInt(Session.get("selectedYear"))})
  }
});

Template.admin.events({
  'submit form': function(event) {
    event.preventDefault();

    var text = $(event.target).find('[name=text]').val();
    //News.insert({ text: text, date: new Date });
    
    alert('Logged in as '+text);
  },
    'click .login': function() {
     Meteor.loginWithTwitter();
    },
    'click .pts': function(event){
        Session.set('ptschange',parseInt(event.currentTarget.id));
    },
    'click .ptsUP' : function(){
        var m = Matches.findOne({_id:Session.get('selectedMatch')});
        if (m.ptsavail == undefined){
            var ptsavail = [1,1,2]; ptsavail[Session.get('ptschange')] = ptsavail[Session.get('ptschange')]+0.5; }
        else {ptsavail = m.ptsavail.values; console.log(ptsavail); ptsavail[Session.get('ptschange')] = ptsavail[Session.get('ptschange')]+0.5; console.log(ptsavail);}
        Matches.update({'_id':m._id},{$set:{'ptsavail.values':ptsavail,'ptsavail.manual':true}});
    },
    'click .ptsDN' : function(){
        var m = Matches.findOne({_id:Session.get('selectedMatch')});
        if (m.ptsavail == undefined){
            var ptsavail = [1,1,2]; ptsavail[Session.get('ptschange')] = ptsavail[Session.get('ptschange')]-0.5; }
        else {ptsavail = m.ptsavail.values; console.log(ptsavail); ptsavail[Session.get('ptschange')] = ptsavail[Session.get('ptschange')]-0.5; console.log(ptsavail);}
        Matches.update({'_id':m._id},{$set:{'ptsavail.values':ptsavail,'ptsavail.manual':true}});
    },
    'click .getholeperformance' : function(){
        var M = Members.find({event:'thecup'});
        
        M.forEach(function(MM){
            var record = [0,0,0];
            m = Matches.find({matchID:{$gt:1300},event:'thecup',type:"singles",T1:{$in:[MM.name]}});

            m.forEach(function(mm){for (var i=9;i<18;i++){switch(mm.result[i]){case 1: record[0]=record[0]+1;break;case -1: record[1]=record[1]+1;break;case 2: record[2]=record[2]+1;break;}}})
            
            m = Matches.find({matchID:{$gt:1300},event:'thecup',type:"singles",T2:{$in:[MM.name]}});

            m.forEach(function(mm){for (var i=9;i<18;i++){switch(mm.result[i]){case -1: record[0]=record[0]+1;break;case 1: record[1]=record[1]+1;break;case 2: record[2]=record[2]+1;break;}}})
            
            console.log(MM.name,",",100*record[0]/(record[0]+record[1]),",",record[0],",",record[1],",",record[2]);

        })

    },
    'click .testEXIF': function(){

        Meteor.call('getEXIF','http://s3-us-east-2.amazonaws.com/cupmedia/ma1701/70fab307-d748-4f6e-9841-2d07d97ffb94.MOV');
        
    },
    'click .updateMediaMetadata': function(){
         var m  = Media.find({});
        m.forEach(function(M){
            Meteor.call('updateMediaMetadata',M._id);
        })
    },
    'click .addplayers': function(){
        var players = [];
        players[0] = {name:"Jonathan Sutton", email: "jtsutt@gmail.com"};
        players[1] = {name:"Joel St. Laurent", email: "stlaurentj@gmail.com"};
        players[2] = {name:"Conor O'Brien", email: "cobrienwm@gmail.com"};
        players[3] = {name:"Jimmy Althaus", email: "jimalthaus@gmail.com"};
        players[4] = {name:"Brad Robinson", email: "bhrobinson311@gmail.com"};
        players[5] = {name:"Alex Anderson", email: "alexanderson1985@gmail.com"};
        players[6] = {name:"Clayton Kilgore", email: "ckilgor5@gmail.com"};
        players[7] = {name:"Sam Lawrence", email: "samplawrence@gmail.com"};
        players[8] = {name:"Stephen Bender", email: "stevejbender@yahoo.com"};
        players[9] = {name:"Mac McKinnon", email: "macmckinnon@21stmortgage.com"};
        players[10] = {name:"Brantley Kilgore", email: "bskilgore1@gmail.com"};
        players[11] = {name:"Cory Wright", email: "cawright21@gmail.com"};
        
        for (var i=0;i<players.length;i++){
            var obj = {"name":players[i].name,
                       "email":players[i].email,
                       "event" : "perkins",
                       "twitter" : "", 
                        "phone" : "",
                        "powerCommissioner" : {
                            "y2017" : "N"
                        }, 
                        "shamblerecord" : [
                            0, 
                            0, 
                            0
                        ], 
                        "singlesrecord" : [
                            0, 
                            0, 
                            0
                        ], 
                        "teamrecord" : [
                            0, 
                            0, 
                            0
                        ], 
                        "stats" : {
                            "tenure" : 0, 
                            "draftperc" : 50.0, 
                            "singlespoints" : 0.0, 
                            "bestballpoints" : 0.0, 
                            "shamblepoints" : 0.0, 
                            "singlesperc" : 50.0, 
                            "bestballperc" : 50.0, 
                            "shambleperc" : 50.0, 
                            "points" : 0.0, 
                            "winperc" : 50.0, 
                            "power" : 50.0, 
                            "impact" : 0.0
                        }, 
                        "singlespoints" : {
                            "y2017" : 0
                        }, 
                        "bestballpoints" : {
                            "y2017" : 0
                        }, 
                        "shamblepoints" : {
                            "y2017" : 0
                        }, 
                        "singlesperc" : {
                            "y2017" : "N"
                        }, 
                        "bestballperc" : {
                            "y2017" : "N"
                        }, 
                        "shambleperc" : {
                            "y2017" : "N"
                        }, 
                        "points" : {
                            "y2017" : 0
                        }, 
                        "draftPos2" : {
                            "y2017" : "N"
                        }, 
                        "powers" : {
                            "y2017" : "N"
                        }, 
                        "cupresult" : {
                            "y2017" : "N"
                        }, 
                        "active" : {
                            "y2017" : 1
                        }, 
                        "impacts" : {
                            "y2016" : 0.0
                        }, 
                        "draftperc" : {
                            "y2017" : "N"
                        }, 
                        "ptsavailable" : {
                            "y2017" : {
                                "singles" : 0, 
                                "shamble" : 0, 
                                "bestball" : 0
                            }
                        }
                       };
                                Members.insert(obj);
         }
    },
    'click .createranking': function(){
        var members = ["Greg Turcotte","Alex Rechtin","Erik Meijer","Jay Sutton","Tony Bickel","Charlie Hornback","Eric Quinn","Mickey Sutton","Jon Eric Hoffman","Cody Collins","Lewis Martin","Erik Wulfeck","Jeremie Imbus","Jason Wulfeck","Kevin Gilles","Kenny Holocher","Conrad Culbertson","Andrew Benzinger","Chris Behler","Joe Mike Morgalis","Troy Kathman","Bret Stephens","Ryan Kennedy","Andrew Webb","Derek Roedig","Sean Schatzman","Chase Higginson","Evan Altevers","Pete Foradas","Jarrod Moon","Greg Erpenbeck","Chris Kramer","Chris Wise","Tyson Saltonyourburger","Chris Rader","Nick Ramler","Mike Stephens","Keith Simpson","Brad Kirn","Andy Wulfeck","Alex Wise","Blake Payne","Drew Fahey","Kyle Lambert"];
        
        var event = 'thecup'; var i = 1;
        members.forEach(function(m){
            console.log(m);
            var M = Members.findOne({event:event,name:m});
            var perc = 100*(1-(i-1)/(members.length-1));
            Members.update({_id:M._id},{$set:{'stats.y2017.ranking.commish':perc}});
            console.log(perc+': updated '+M.name);
            i++;
        })
        
        
    },
    'click .getpartnerstat': function(event,template){
        Meteor.subscribe('members',Session.get('currentevent'));
        Meteor.subscribe('matches',Session.get('currentevent'),0);
        console.log('entered getpartnerstat');
        var m = Members.find({event:Session.get('currentevent')},{sort:{name:-1}});
        m.forEach(function(mm){
            var pWIN = 0; var pAVAIL = 0;
            var b = Matches.find({type:'bestball',matchID:{$gt:1300,$lt:1700}});
            b.forEach(function(bb){
                if (bb.T1[0] == mm.name){
                    var p = bb.T1[1]; 
                    var pm = Matches.findOne({type:'singles','T1.0':p,matchID:{$gt:bb.matchID-3,$lt:bb.matchID+3}});
                        pWIN = pWIN + pm.T1pts; pAVAIL = pAVAIL + 2;}
                if (bb.T1[1] == mm.name){
                    var p = bb.T1[0];
                    var pm = Matches.findOne({type:'singles','T1.0':p,matchID:{$gt:bb.matchID-3,$lt:bb.matchID+3}});
                        pWIN = pWIN + pm.T1pts; pAVAIL = pAVAIL + 2;}
                if (bb.T2[0] == mm.name){
                    var p = bb.T2[1];
                    var pm = Matches.findOne({type:'singles','T2.0':p,matchID:{$gt:bb.matchID-3,$lt:bb.matchID+3}});
                        pWIN = pWIN + pm.T2pts; pAVAIL = pAVAIL + 2;}
                if (bb.T2[1] == mm.name){
                    var p = bb.T2[0];
                    var pm = Matches.findOne({type:'singles','T2.0':p,matchID:{$gt:bb.matchID-3,$lt:bb.matchID+3}});
                        pWIN = pWIN + pm.T2pts; pAVAIL = pAVAIL + 2;}
            })
            console.log(mm.name +","+ pWIN+","+ pAVAIL+","+ 100*pWIN/pAVAIL)
        })
    },
    'click .getpartnerstat2': function(event,template){
        //prints partner over year interval
        Meteor.subscribe('members',Session.get('currentevent'));
        Meteor.subscribe('matches',Session.get('currentevent'),0);
        console.log('entered getpartnerstat2');
        var m = Members.find({event:Session.get('currentevent')},{sort:{name:-1}});
        m.forEach(function(mm){
            if (mm.stats.y2016.active){
            console.log(mm.name + ", 2016," +  mm.stats.y2016.power + "," +  mm.stats.y2016.draft.perc + "," +  (parseInt(mm.stats.y2016.bestball.points)+parseInt(mm.stats.y2016.shamble.points)+parseInt(mm.stats.y2016.singles.points)));}
            if (mm.stats.y2015.active){console.log(mm.name + ", 2015," +  mm.stats.y2015.power + "," +  mm.stats.y2015.draft.perc + "," +  (parseInt(mm.stats.y2015.bestball.points)+parseInt(mm.stats.y2015.shamble.points)+parseInt(mm.stats.y2015.singles.points)));}
            if (mm.stats.y2014.active){console.log(mm.name + ", 2014," +  mm.stats.y2014.power + "," +  mm.stats.y2014.draft.perc + "," +  (parseInt(mm.stats.y2014.bestball.points)+parseInt(mm.stats.y2014.shamble.points)+parseInt(mm.stats.y2014.singles.points)));}
            
            var b = Matches.find({$or:[{'T1.0':mm.name},{'T1.1':mm.name},{'T2.0':mm.name},{'T2.1':mm.name}],matchID:{$gt:1400,$lt:1700}},{sort:{matchID:1}});
            
            b.forEach(function(bb){
                console.log(bb.matchID + ", " + bb.type + ", " + bb.T1[0] + ", " + bb.T1[1] + ", " + bb.T1pts + ", " + bb.T2[0] + ", " + bb.T2[1] + ", " + bb.T2pts);
            })            
        })
    },
    'change .currentmatch': function(event, template){
    var matchID = parseInt(currentmatch.value); // could be the P or a child element
    var y = Matches.findOne({matchID:matchID,event:Session.get('currentevent')});
    Session.set('selectedMatch',y._id);      
    }, 
    'change .currentyear': function(){
    var year = currentyear.value; // could be the P or a child element
    Session.set('selectedYear',year);
    },
    'change .P11': function(){
    var player = P11.value; // could be the P or a child element
        console.log(player);
    Matches.update({_id:Session.get('selectedMatch')},{$set:{P11:player}});
    },
    'change .P12': function(){
    var player = P12.value; // could be the P or a child element
    Matches.update({_id:Session.get('selectedMatch')},{$set:{P12:player}});
    },
    'change .P21': function(){
    var player = P21.value; // could be the P or a child element
    Matches.update({_id:Session.get('selectedMatch')},{$set:{P21:player}});
    },
    'change .P22': function(){
    var player = P22.value; // could be the P or a child element
    Matches.update({_id:Session.get('selectedMatch')},{$set:{P22:player}});    
    },
    'click .updateplayer': function(){
        var types = ['points','power','tenure'];
        Meteor.call('updatememberstats',{name:'all',event:Session.get('currentevent')},types);
        //updatecuprecord('all',[2017]);
    },
    'click .updatematchpower': function(){
        Meteor.call('updatematch',{event:Session.get('currentevent'),matchID:'all'},['powers']);  
        
        //updatematch(1611,'powers'); 
        //var y = Meteor.call('aggroster');
        //console.log(y);
        //for (var i = 1; i<1650;i++){
        //    updatematch(1600+i,'powers');  
        //}
    },
    'click .updateteamstats': function(){
        console.log('updating team stats');
        var types = ['winperc','singlesperc','bestballperc','shambleperc','tenure','power','impact'];
        Meteor.call('updateteamstats',{defending:0,year:Session.get('selectedYear'),event:Session.get('currentevent')},types);  
        Meteor.call('updateteamstats',{defending:1,year:Session.get('selectedYear'),event:Session.get('currentevent')},types);  
    },
    'click .matchpredict': function(){
        updatematch(1601,'predict')
        updatematch(1602,'predict')
        updatematch(1603,'predict')
        updatematch(1604,'predict')
        updatematch(1605,'predict')
        updatematch(1606,'predict')
        updatematch(1607,'predict')
        updatematch(1608,'predict')
        updatematch(1609,'predict')
        updatematch(1610,'predict')
    },
    'click .testnotification': function(){
        sAlert.info('<a href="/">Wow, you should be here.</a>', {effect: 'slide', html:true, position: 'bottom', timeout: 'none', onRouteClose: true, stack: false, offset: '0px'});
        //sAlert.error('Boom! Something went wrong!', {effect: 'slide', position: 'bottom', timeout: 2000, onRouteClose: true, stack: false, offset: '0px'});
    },
    'click .resetcup': function(){
        //this function resets the following
        //cup scoring
        //match points
        //matchholes (leaves results vector)
        console.log('started');
        var year = Session.get('selectedYear'); var event = Session.get('currentevent'); var yearidx = 100*(year-2000);
        var c = Cups.findOne({year:year,event:event});
        Cups.update({_id:c._id},{$set:{T1ptsDAY:[0,0],T2ptsDAY:[0,0],T1pts:0,T2pts:0,T1leads:0,T2leads:0,ties:0,T1predict:55,T2predict:55}});
        
        var m = Matches.find({matchID:{$gt:yearidx,$lt:yearidx+100},event:event});
        m.forEach(function(M){
            var result = [];
            for (var i=1;i<19;i++){
                result[i-1] = eval('M.holes.h'+i+'.result');
            }
            Matches.update({_id:M._id},{$set:{result:result}});
        })
                  
        var hole = {
                            "result" : 2,
                            "status" : {
                                "all": 'N',
                                "f9" : 'N',
                                "b9" : 'N'
                            },
                            "location" : "", 
                            "event" : {
                                "status": "",
                                "leads": "",
                                "predict" : ""
                            }                            
                }; var holes = {};
        for (var i=1;i<19;i++){
            eval('holes.h'+ i +' = hole;');
        }
        
        m.forEach(function(x){
            Matches.update({_id:x._id},{$set:{holes:holes,hole:0,T1pts:0,T2pts:0,status:0}});
            var newtime = x.time; var dT=0;
            for (var i=1;i<19;i++){
                newtime.setMinutes(newtime.getMinutes() + 16.67);
                newtime.setSeconds(newtime.getSeconds() + Math.floor(Math.random()*30));
                eval('Matches.update({_id:x._id},{$set:{\'holes.h'+i+'.time.expected\':newtime,predict:[0,0]}})');
            }
        })
    console.log('cup reset');  
    },
    'click .resetexhibition': function(){
        //this function resets the following
        //cup scoring
        //match points
        //matchholes (leaves results vector)
        console.log('started');
        var year = Session.get('selectedYear'); 
        var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')}); var unique = e.unique+(year-2000);
        
        var m = Matches.find({matchID:{$regex:unique},event:Session.get('currentevent')});
        var hole = {
                            "result" : "N",
                            "net" : "N",
                            "status" : {
                                "all": 'N',
                                "f9" : 'N',
                                "b9" : 'N'
                            },
                            "netstatus" : {
                                "all": 'N',
                                "f9" : 'N',
                                "b9" : 'N'
                            },
                            "location" : ""                 
                }; var holes = {};
        for (var i=1;i<19;i++){
            eval('holes.h'+ i +' = hole;');
        }
        
        m.forEach(function(x){
            Matches.update({_id:x._id},{$set:{holes:holes,hole:0,netstatus:0,status:0}});
            var newtime = x.time; var dT=0;
            for (var i=1;i<19;i++){
                newtime.setMinutes(newtime.getMinutes() + 16.67);
                newtime.setSeconds(newtime.getSeconds() + Math.floor(Math.random()*30));
                eval('Matches.update({_id:x._id},{$set:{\'holes.h'+i+'.time.expected\':newtime}})');
            }
        })
    console.log('exhibition reset: ',e.description);  
    },
    'click .resetexpectedtimes': function(){
        resetexpectedtimes();
    },
    'click .resetcupmatches2': function(){
        var course = "westhaven";
        var P11 = "Martin ";
        var P12 = "Martin ";
        var P21 = "Kennedy ";
        var P22 = "Kennedy ";
        var origdate = new Date();
            origdate.setMonth(9);
            origdate.setDate(29);
            origdate.setHours(8);
            origdate.setMinutes(0);
            origdate.setSeconds(0);
        
        //add day 1 matches
        var type = "shamble";
        var time = "SEP 8, ";
        var day  = 1;
        for (var i = 0; i<10; i++){
            origdate.setMinutes(origdate.getMinutes() + 10);
            addmatch(1600+i+1,
                     P11.concat(2*i+1),P12.concat(2*i+2),
                     P21.concat(2*i+1),P22.concat(2*i+2),
                     type,origdate,
                     course,day);
            console.log(1600+i+1 + " added");
        }
        
        //add day 2 matches
            type = "singles";
        var day  = 2;
            origdate.setMonth(9);
            origdate.setDate(30);
            origdate.setHours(8);
            origdate.setMinutes(0);
            origdate.setSeconds(0);
        for (var i = 1; i<29; i++){
            origdate.setMinutes(origdate.getMinutes() + 10);
            addmatch(1600+i+14,
                     P11.concat(i),"",
                     P21.concat(i),"",
                     type,origdate,
                     course,day);
            console.log(origdate.getMinutes());
        }
        
    
    },
    'click .simulatecup': function(){
        pushhistory();
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
    videoinfo.IDs.forEach(function(V){
        var type = 'video';
        
        m = Media.findOne({_id:V});
        if (m !== undefined) {
            h = History.findOne({matchID:m.data.matchID,match_hole:{$lte:m.info.hole},event:Session.get('currentevent')},{sort:{match_hole:-1,time:-1}})
            c = Courses.findOne({description:m.data.course});
        }
        else {
                c = null;
        }
            if (m.info.hole<1)  {h = History.findOne({event:Session.get('currentevent')},{sort:{'time':1}})}
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
    'click .clearmedia': function(){
        console.log('clearing media');
        var mid = (Session.get('selectedYear')-2000)*100;
        var h = Media.find({'data.matchID':{$gt:mid,$lt:mid+100}})
        h.forEach(function(H){
            Media.remove({_id:H._id});
        })
    },
    'click .clearhistory': function(){
        console.log('clearing history');
        var mid = (Session.get('selectedYear')-2000)*100;
        var h = History.find({matchID:{$gt:mid,$lt:mid+100}});
        h.forEach(function(H){
            History.remove({_id:H._id});
            console.log(H._id,' removed');
        })
        
        
    },
    'click .simulateExhibition': function(){
        pushhistoryE();
    },
    'click .simulatematch': function(){
        simulatematch(1601);
    },
    'click .trainmatches': function(){
        Meteor.call('trainMatchPredictor',{event:Session.get('currentevent'),years:[2012,2016]});
    },
    'click .cuprecordupdate': function(){
        updatecuprecord('all',yearsarray());
    },
    'click .updatecup': function(){
        console.log('clicked');
        Meteor.call('updatecup',{matchID:701,event:Session.get('currentevent')},'MVP');
    },
     'click .updateevent': function(){
        console.log('clicked');
        var types = ['powers','winperc'];
        Meteor.call('updatematch',{event:Session.get('currentevent'),matchID:'all'},types);   
        Meteor.call('updatecup',{matchID:1701,event:Session.get('currentevent')},'MVP');
        var types = ['active','points','draftperc','power','tenure','winperc','cuprecord'];
        Meteor.call('updatememberstats',{name:'all',event:Session.get('currentevent')},types); 
    },
    'click .setactivemembers': function(){
        var m = Members.find({event:Session.get('currentevent')});
        m.forEach(function(x){
            if (x.stats.y2018.active) {freshstat.active = 1;}
            else {freshstat.active = 0;}
            Members.update({_id:x._id},{$set:{'stats.y2019':freshstat}});
            console.log(x.name," activated. Active: ", freshstat.active);
        })
    },
    'click .scrapehistory': function(){
        Meteor.subscribe('history',{year:Session.get('selectedYear'),event:Session.get('currentevent')})
        var iyr = 100*(Session.get('selectedYear')-2000);
        var h = History.find({matchID:{$gt:iyr,$lt:iyr+100}},{sort:{date:-1}}); var hh;
        h.forEach(function(H){
            hh = History.find({_id:{$not:H._id},matchID:H.matchID,match_hole:H.match_hole});
            hh.forEach(function(HH){
                History.remove({_id:HH._id});
                console.log(HH.matchID,HH.match_hole,"removed");
            })
        })
        
        
    },
    'click .customscript': function(){
        var type = 'resetholes';
        //console.log("entered1");
        
        switch (type){
        case 'resetholes':
                mid = 100*(Session.get('selectedYear')-2000);
                var holes = {};              
                
                
                //resets holes for all matches of that year
                var m = Matches.find({matchID:{$gt:mid,$lt:mid+100},event:Session.get('currentevent')});
                m.forEach(function(M){
                    for (var i=1; i<19; i++){
                        var t = new Date(M.time);
                        var min = t.getMinutes()+i*15;
                        t.setMinutes(min);
                        var H = {
                        "result" : 2, 
                        "status" : {
                            "all" : "N", 
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
                            "expected" : t
                        }
                        }
                        eval('holes.h'+i+'=H');
                    }
                        Matches.update({_id:M._id},{$set:{holes:holes}});
                        console.log(M.matchID + 'updated')
                })
        case 'transferhole':
                var m = Matches.find({matchID:{$gt:1500,$lt:1580},event:'thecup'}); var hole; var location = {}; var event_status = {}; var event_leads = {};
                m.forEach(function(x){
                    Matches.update({_id:x._id},{$set:{holes:{}}}); var status = 0; var statusflag = 1; var maxpredict = 0; 
                    for (var i=1; i<19;i++){
                        var h = {}; var location = {}; var event_status = {}; var event_leads = {}; var predict = [0,0];
                        
                        if (statusflag) {
                        switch (x.result[i-1]) {
                            case 2:
                                status = 'N'; statusflag = 0;
                            break;
                            case 1: 
                                status = status + 1;
                            break;
                            case -1:
                                status = status - 1;
                            break;                                
                        }
                        }
                        
                        h = History.find({matchID:x.matchID, match_hole:i,'time.month':9});
                        h.forEach(function(y){
                            if (y.event_id == "55f97c043004bb86c90a350f"){
                                location=y.location; event_status=y.event_status; event_leads=y.event_leads;
                                    if (status > 1)        {predict[1] = event_status[1]+0;predict[0] = event_status[0]+2;}
                                    else if (status < -1)  {predict[1] = event_status[1]+2;predict[0] = event_status[0]+0;}
                                    else if (status == 1)  {predict[1] = event_status[1]+2;predict[0] = event_status[0]+1;}
                                    else if (status == 0)  {predict[1] = event_status[1]+2;predict[0] = event_status[0]+2;}
                                    else if (status == -1) {predict[1] = event_status[1]+1;predict[0] = event_status[0]+2;}
                            }
                            })
                        if (status !== 'N') {var maxpredict = predict;}
                        hole = {
                            "result" :       x.result[i-1],
                            "status" : {
                                "all": status
                            },
                            "location" :     location, 
                            "event" : {
                                "status": event_status,
                                "leads": event_leads,
                                "predict" : predict
                            }                            
                        };
                        eval('Matches.update({_id:x._id},{$set:{\'holes.h'+i+'\':hole,predict:maxpredict}})');
                    }
                })
                break;
        case 'addtag':
            var y = Matches.find({});
            y.forEach(function(x){
                Matches.update({_id:x._id},{$set:{event:"thecup"}})
            })
            var y = Members.find({});
            y.forEach(function(x){
                Members.update({_id:x._id},{$set:{event:"thecup"}})
            }) 
            var y = Rosters.find({});
            y.forEach(function(x){
                Rosters.update({_id:x._id},{$set:{event:"thecup"}})
            })
            var y = Cups.find({});
            y.forEach(function(x){
                Cups.update({_id:x._id},{$set:{event:"thecup"}})
            })
            break;
        case 'cuprecordreset':
            var y = Members.find({});
            y.forEach(function(x){
                Members.update({_id:x._id},{$set:{
                                      'cupresult.y2016':0,
                                      'cupresult.y2015':0,
                                      'cupresult.y2014':0,
                                      'cupresult.y2013':0,
                                      'cupresult.y2012':0,
                                      'cupresult.y2011':0,    
                                      'cupresult.y2010':0,
                                      'cupresult.y2009':0,
                                      'cupresult.y2008':0,
                                      'cupresult.y2007':0
                                     }
                               });
                })
        break; 
        case 'cupfield':
            var y = Cups.find({});
            y.forEach(function(x){
                //Members.update({_id:x._id},{$unset:{cupresult:""}});
                Cups.update({_id:x._id},{$set:{description:"The Cup"}
                               });
            })
        break;        
        case 'resetactive':
            var y = Members.find({});
            y.forEach(function(x){
                Members.update({_id:x._id},{$unset:{active:""}});
                Members.update({_id:x._id},{$set:{
                                      'active.y2016':0,
                                      'active.y2015':0,
                                      'active.y2014':0,
                                      'active.y2013':0,
                                      'active.y2012':0,
                                      'active.y2011':0,
                                      'active.y2010':0,
                                      'active.y2009':0,
                                      'active.y2008':0,
                                      'active.y2007':0
                                     }
                               });
            })
        break;
        case 'resetimpacts':
            var y = Members.find({});
            y.forEach(function(x){
                Members.update({_id:x._id},{$unset:{impacts:""}});
                Members.update({_id:x._id},{$set:{
                                      'impacts.y2016':0,
                                      'impacts.y2015':0,
                                      'impacts.y2014':0,
                                      'impacts.y2013':0,
                                      'impacts.y2012':0,
                                      'impacts.y2011':0,
                                      'impacts.y2010':0,
                                      'impacts.y2009':0,
                                      'impacts.y2008':0,
                                      'impacts.y2007':0
                                     }
                               });
            })
        break;
        case 'resetavailablepts':
            var y = Members.find({}); var ptsyear;
            y.forEach(function(x){
                //Members.update({_id:x._id},{$unset:{ptsavailable:""}});
                for (var year = 2007; year<=2016; year++){
                    ptsyear = [0,0,0]; var yridx = 100*(year-2000);
                    var m = Matches.find({ $and: [{matchID:{$gt:yridx,$lt:yridx+99}}, {$or: [{P11: x.name},{P12: x.name},{P21: x.name},{P22: x.name}] }]},{sort:{matchID:-1}});
                    m.forEach(function(y){
                        switch (y.type){
                            case 'singles':
                                ptsyear[0]=ptsyear[0]+2;
                            break;
                            case 'shamble':
                                ptsyear[1]=ptsyear[1]+4;
                            break;
                            case 'bestball':
                                ptsyear[2]=ptsyear[2]+2;
                            break;    
                        }
                    });
                    eval('Members.update({_id:x._id},{$set:{\'ptsavailable.y'+year+'\':{\'singles\':'+ptsyear[0]+',\'shamble\':'+ptsyear[1]+',\'bestball\':'+ptsyear[2]+'}}});');
                }
            })
        break;        
        case 'resetdraftperc':
            var y = Members.find({});
            y.forEach(function(x){
                Members.update({_id:x._id},{$unset:{draftperc:""}});
                Members.update({_id:x._id},{$set:{
                                      'draftperc.y2016':0,
                                      'draftperc.y2015':0,
                                      'draftperc.y2014':0,
                                      'draftperc.y2013':0,
                                      'draftperc.y2012':0,
                                      'draftperc.y2011':0,   
                                      'draftperc.y2010':0,
                                      'draftperc.y2009':0,
                                      'draftperc.y2008':0,
                                      'draftperc.y2007':0
                                     }
                               });
            })
        break;
        case 'computeactive':
            var r = Rosters.find({},{sort:{year:1}});
            r.forEach(function(x){
                for (var idx = 0; idx < x.members.length; idx++){
                    console.log(x.members[idx]);
                    var m = Members.findOne({name:x.members[idx]});
                    eval('Members.update({_id:m._id},{$set:{\'active.y'+x.year+'\':1,\'cupresult.y'+x.year+'\':x.winner}})');
                }  
            })
        break;
        }            
    },
    'click .addcupmatches': function(){
        var P11 = "Kitko ";
        var P12 = "Kitko ";
        var P21 = "Dunmead ";
        var P22 = "Dunmead ";
        
        
        //add day 1 matches
        var type = "scramble2man";
        var origdate = new Date();
            origdate.setYear(2019);
            origdate.setMonth(8);
            origdate.setDate(31);
            origdate.setHours(13);
            origdate.setMinutes(21);
            origdate.setSeconds(0);
        var day  = 1; var course = "timberridge"; var matchID=1901; var event=Session.get('currentevent');
            addmatch(matchID, [P11.concat(1),P12.concat(2)],[P21.concat(1),P22.concat(2)],
                               type,origdate,course,day,event); matchID++;
            origdate.setMinutes(origdate.getMinutes() + 10);
            addmatch(matchID, [P11.concat(3),P12.concat(4)],[P21.concat(3),P22.concat(4)],
                               type,origdate,course,day,event); matchID++;
            origdate.setMinutes(origdate.getMinutes() + 10);
            addmatch(matchID, [P11.concat(5),P12.concat(6)],[P21.concat(5),P22.concat(6)],
                               type,origdate,course,day,event); matchID++;
            origdate.setMinutes(origdate.getMinutes() + 10);
            addmatch(matchID, [P11.concat(7),P12.concat(8)],[P21.concat(7),P22.concat(8)],
                               type,origdate,course,day,event); matchID++;
            
        
        //add day 2 matches
        var origdate = new Date();
             origdate.setYear(2019);
            origdate.setMonth(9);
            origdate.setDate(1);
            origdate.setHours(11);
            origdate.setMinutes(0);
            origdate.setSeconds(0);
        var type = "scramble4man";
        var day  = 2; var course = "eagleeye"; var event=Session.get('currentevent');
            addmatch(matchID, [P11.concat(1),P11.concat(2),P11.concat(3),P11.concat(4)],
                              [P21.concat(1),P21.concat(2),P21.concat(3),P21.concat(4)],
                               type,origdate,course,day,event); matchID++;
            addmatch(matchID, [P11.concat(5),P11.concat(6),P11.concat(7),P11.concat(8)],
                              [P21.concat(5),P21.concat(6),P21.concat(7),P21.concat(8)],
                               type,origdate,course,day,event);
            
            
        
    },
    'click .matchbreakdown': function(){
        var yr = Session.get('selectedYear');
        var mid = 100*(yr-2000);
        m = Matches.find({matchID:{$gt:mid,$lt:mid+100},day:1,event:Session.get('currentevent')},{sort:{matchID:1}});
                
        m.forEach(function(mm){
            var stat1 = {power:0,powerlast:0,draftperc:0,shambleperc:0};
            var stat2 = {power:0,powerlast:0,draftperc:0,shambleperc:0};
            var p = Members.find({name:{$in:mm.T1}});
                var i =0;
                p.forEach(function(pp){
                                  stat1.power = stat1.power + parseInt(pp.stats.power);
                                  stat1.powerlast = stat1.powerlast + parseInt(eval('pp.stats.y'+yr+'.power'));
                                  stat1.draftperc = stat1.draftperc + parseInt(eval('pp.stats.y'+yr+'.draft.perc'));
                                  stat1.shambleperc = stat1.shambleperc + parseInt(pp.stats.shambleperc);
                                  i++;
                                 })
            var p = Members.find({name:{$in:mm.T2}});   
                var i =0;
                p.forEach(function(pp){
                                  stat2.power = stat2.power + parseInt(pp.stats.power);
                                  stat2.powerlast = stat2.powerlast + parseInt(eval('pp.stats.y'+yr+'.power'));
                                  stat2.draftperc = stat2.draftperc + parseInt(eval('pp.stats.y'+yr+'.draft.perc'));
                                  stat2.shambleperc = stat2.shambleperc + parseInt(pp.stats.shambleperc);
                                  i++;
                                 })
                
                console.log("=======================");
                console.log(mm.type + " " + mm.T1[0],mm.T1[1]," ", mm.T2[0],mm.T2[1]);
                console.log("Power T1", stat1.power,"T2",stat2.power,"d",stat1.power-stat2.power);
                console.log("PowerLast T1", stat1.powerlast,"T2",stat2.powerlast,"d",stat1.powerlast-stat2.powerlast);
                console.log("DraftPerc T1", stat1.draftperc,"T2",stat2.draftperc,"d",stat1.draftperc-stat2.draftperc);
                console.log("ShamblePerc T1", stat1.shambleperc,"T2",stat2.shambleperc,"d",stat1.shambleperc-stat2.shambleperc);
        
        })
    
    },
    'click .resetcupmatches': function(){
        var m = Matches.find({matchID:{$gt:700}});
            var origdate = new Date;
            origdate.setSeconds(0);
        m.forEach(function(x){
            var matchID = x.matchID;
            //if (matchID[0]>0){var matchID = x.matchID;}
            //else {.substring(1,x.matchID.length-1)}
            
            var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
            var time = x.time.split(",");
            var monthdate = time[0].split(" ");
            var hourmin   = time[1].split(":");
            var year = 2000+parseInt(matchID/100);
                        
            origdate.setYear(year);
            origdate.setMonth(months.indexOf(monthdate[0]));
            origdate.setDate(monthdate[1]);
            origdate.setHours(hourmin[0]);
            origdate.setMinutes(hourmin[1]);
            console.log(x.matchID + " " + origdate);
            
            Matches.update({_id:x._id},{$set:{time:origdate}});
            
        })
        
    
    } //end resetcupmatch2
    
    
})