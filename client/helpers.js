var moment = require('moment');
var debug = 0;


pluralize = function(n, thing, options) {
  var plural = thing;
  if (_.isUndefined(n)) {
    return thing;
  } else if (n !== 1) {
    if (thing.slice(-1) === 's')
      plural = thing + 'es';
    else
      plural = thing + 's';
  }

  if (options && options.hash && options.hash.wordOnly)
    return plural;
  else
    return n + ' ' + plural;
}
addarray = function(arr){
    var s = 0;
    arr.forEach(function(a){
        s = s + a;
    })
    return s
}

uppercase = function(s){
return s.toUpperCase()
}

parseteamname = function(T) {
    var TT = []; var sp = "";
    for (var i = 0; i < T.length;i++){
        if (i>0) {sp = " ";}
        TT[i] = sp + firstinitiallastname(T[i]);
    }
    return TT
}

lastname = function(fullname) {
    var name = fullname.split(" ");
    return name[name.length-1];
}

getdate = function(time){
var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    
    var t = time;

 //           if (t.getMinutes() == 0)
//          {var mins = "00";}
//            else {var mins = t.getMinutes();}
            
//           if (t.getHours()>=12) 
//            {var out = months[t.getMonth()] + " " + t.getDate() + " " + t.getHours()-12 + ":" + mins; return out + " PM"}
//            else {var out = months[t.getMonth()] + " " + t.getDate() + " " + t.getHours() + ":" + mins; return out + " AM"} 
    return months[t.getMonth()]  + " " + t.getDate() 

}

variance = function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.pow(num - mean, 2);
		}));
	}

mean = function(array){
    return Math.mean(array)
}

abs = function(n) {
    return Math.abs(n)
}	

standardDeviation = function(array) {
		return Math.sqrt(arr.variance(array));
	}
        
compare = function(n1,n2){
    //true if n1 is greater or equal to n2
    return n1>n2
}

isequal = function(n1,n2){
    //true if n1 is greater or equal to n2
    //console.log(n1,n2);
    return n1==n2
}

strcmp = function(a, b) {
    return a == b
}

multiply = function(n1,n2){
    //true if n1 is greater or equal to n2
    return formatdecimal(n2*n1,0)
}

add = function(n1,n2){
    return n1+n2
}

idx2year = function(matchID,short) {
        var year = parseInt(matchID/100);
        if (!short) {year = year +2000;}
    return year
}

subtract = function(n1,n2) {
    return formatdecimal(n1-n2,0)
}

formatdecimal = function(num,digits) {
    if (typeof num !== 'undefined' & !isNaN(num)){
    return num.toFixed(digits)}
}

firstinitiallastname = function(fullname) {
    var name = fullname.split(" ");
    return name[0][0] + ". " + name[name.length-1];
}

isteammatch = function (matchID) {
    var cursor = Matches.find({matchID:matchID,event:Session.get("currentevent")});var type; var out;
      cursor.forEach(function(x){
        if (x.type == "shamble" || x.type == "bestball" || x.type == "alternate"){out=1;}
      })
      return out
  }

formatdate = function(d,formatstring){
    var m = moment(d);
    return m.format(formatstring)
}

formattwitter = function (type){
    var str = "https://pbs.twimg.com/profile_images/3176931673/4a6505a964c0fbcd57b7798a67c0ffac_normal.jpeg";
    var f = str.substr(0,str.lastIndexOf("_"));
    return f+"_bigger.jpeg"
}

addmatch = function(matchID,T1,T2,type,time,course,day,event){
    Matches.insert(
                { 
            "matchID" : matchID, 
            "type" : type, 
            "hole" : 0, 
            "time" : time, 
            "T1pts" : 0, 
            "T2pts" : 0, 
            "status" : 0, 
            "course" : course, 
            "statusF9" : 0, 
            "statusB9" : 0, 
            "day" : day, 
            "T1chances" : 0, 
            "T2chances" : 0, 
            "T1odds" : "EVEN", 
            "T2odds" : "EVEN", 
            "stats" : {
                "powerP11" : 0, 
                "powerP12" : 0, 
                "powerP21" : 0, 
                "powerP22" : 0, 
                "predict" : [0,0], 
                "dH" : 0
            }, 
            "record" : {
                "par3" : [0,0,0], 
                "par4" : [0,0,0], 
                "par5" : [0,0,0]
            }, 
            "predict" : [0,0],
            "event"   :event,
            "T1": T1,
            "T2": T2
        }
    
    
    )

}
getcups = function (){
    return Cups.find({event:Session.get('currentevent')},{sort:{year:-1}});  
  }
getcurrentevent = function(){
    return Session.get("currentevent");
  }
  cupinfo = function () {
    var year = Session.get("selectedYear");
    return Cups.findOne({year:parseInt(year),event:Session.get("currentevent")}); 
} 
  getslideryears =  function(){
        var years = [];
        var c = Cups.findOne({event:Session.get('currentevent')},{sort:{year:1}});
        years[0] = c.year;
        var c = Cups.findOne({event:Session.get('currentevent')},{sort:{year:-1}});
        years[1] = c.year;
        return years
    }
updatecuprecord = function (member,yrs){
    console.log("UPDATING CUP RECORDS");
    if (member == "all") {var m = Members.find({event:Session.get('currentevent')});}
    else {var m = Members.find({event:Session.get('currentevent'),name:{$in:[member]}});}
    
            m.forEach(function(x){
                var cumlosses=0; var cumwins=0;
                for (var y=0;y<yrs.length;y++){
                    var r = Rosters.findOne({event:Session.get('currentevent'),year:yrs[y],members:{$in:[x.name]}}); var result = 0;
                    if (r !== undefined){
                                        switch (r.winner) {
                                            case 2:
                                                result = r.winner;
                                            break;
                                            case 1:
                                                result = r.winner; cumwins++;
                                            break;
                                            case 0:
                                                result = r.winner; cumlosses++;
                                            break;
                                        }
                    }
                    eval('Members.update({_id:x._id},{$set:{\'stats.y'+yrs[y]+'.cuprecord\':result}});');
                    console.log(x.name, yrs[y],result);
                }
                var cuprecord = [cumwins,cumlosses];
                    eval('Members.update({_id:x._id},{$set:{\'stats.cuprecord\':cuprecord}});');                            
            })
}

  iscurrentyear = function (year){
      var out = "";
    if (parseInt(year) == Session.get("selectedYear")){out = "selected";}
      return out
  }
  isdayaccessopen = function (matchID){
    var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});     
    var m = Matches.findOne({matchID:matchID,event:Session.get('currentevent')})
    var access = c.access[m.day-1];
      if (debug) {console.log('day access is ',access)}
    return access 
  }
  
isglobalscorekeeper = function (matchID) {
        // checks if user is either an admin or a global login for that event
    var e = Events.findOne({description:Session.get('currentevent')},{globalscorer:1});
    if (isscorekeeper(matchID)) {if (debug) {console.log('is a scorekeeper'); } return true;}

    else if (Meteor.user().emails[0].address.toLowerCase() == e.globalscorer || isAdmin()) {
        if (debug) {console.log('is either an admin or global login');}
        return true;
     } else {if (debug) {console.log('no scoring credentials');} return false}
}  
isscorekeeper = function (matchID){
      var year = parseInt(matchID/100)+2000;
      if (matchID>0){var y = Cups.findOne({year:year,event:Session.get("currentevent")});}
      else {var y = Exhibitions.findOne({unique:matchID[0],year:Session.get('selectedYear')})}
              
      // Grab current user, if not logged in, skip.
      if (Meteor.user().services.twitter !== undefined){
          var login = Meteor.user().services.twitter.screenName.toLowerCase();
      }
      else if (Object.keys(Meteor.user().emails).length > 0){
          var login = Meteor.user().emails[0].address.toLowerCase();
      }    
      else {return false}
    
      // Define administrators
      
      var exceptions = y.admins;
        //console.log('this users UN is', login);
        //console.log('current admins are', exceptions);
      if (exceptions.indexOf(login) >= 0) {out = true;}// if not an admin
      else {
          
      // Grant matchwise login access
      var mp = 0; var out = false; var members = [];
      var z = Matches.findOne({matchID:matchID,event:Session.get("currentevent")},{stats:0,holes:0});
      var curs = Matches.find({event:Session.get("currentevent"),time:z.time});
        curs.forEach(function(x){
            members = members.concat(x.T1);
            members = members.concat(x.T2);
        })
        //console.log('members in this match are', members);
      
      var cur = Members.find({name:{$in:members},event:Session.get("currentevent")});
          var matchmemlogin = [];
      cur.forEach(function(x){
          //console.log(x.twitter);
          if (x.twitter !== undefined) {matchmemlogin = matchmemlogin.concat(x.twitter.toLowerCase());}
          if (x.email !== undefined) {matchmemlogin = matchmemlogin.concat(x.email.toLowerCase());}
      })
       //console.log('their usernames are', matchmemlogin);
          //console.log('the admin matches are: ',login);
       if (matchmemlogin.indexOf(login) >= 0) {
           //console.log(y)
           out = y.access[z.day-1]; 
           //console.log('UN match, day access is:', y.access[z.day-1]);
       }
        
      }
      //console.log('this user is',out);
      return out
}

printmatchpredictions = function(){

m.forEach(function(M){ 

    var t1 = Members.find({name:{$in:M.T1}}); var pwrT1 =0;
    t1.forEach(function(T){
        pwrT1 = pwrT1 + T.stats.power;
        console.log(T.name + ': ' + T.stats.power + ' ');
    })
    console.log('Total: ' + pwrT1 + '\n');
    var t2 = Members.find({name:{$in:M.T2}}); pwrT2 =0;
    t2.forEach(function(T){
         pwrT2 = pwrT2 + T.stats.power;
        console.log(T.name + ': ' + T.stats.power + ' ');
    })
    console.log('Total: ' + pwrT2 + '\n');
    console.log('Difference: ' + (pwrT1-pwrT2));
})

}


aggregatememberstats = function(years, pointflag, sortstr, name){
    Session.set('scriptrunning',1);
    Meteor.call('getmemberstats', years, pointflag, sortstr, name, Session.get('currentevent'), function(error, result){
        //if (error) {alert('Error');} else {Session.set('data', result)}
        Session.set('data', result);
      });
    Session.set('scriptrunning',0);
}
eventinfo = function(){
    return Events.findOne({description:Session.get("currentevent")})
}
getteetime = function(matchID,type){
    //console.log('test',matchID, type);
    //if you pass a number below 4, returns tee time for first match on that day of currently selected year
    //if you pass a matchID, then it grabs that one
    if (matchID < 5){
        if (matchID == 4){
            var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
            var mstr = e.unique+(100*(Session.get('selectedYear')-2000)+1);
            var m = Matches.findOne({matchID:mstr});
        }
        else {
            var yridx = 100*(Session.get('selectedYear')-2000); 
            var m = Matches.findOne({matchID:{$gt:yridx+1,$lt:yridx+100},day:matchID,event:Session.get("currentevent")},{sort:{matchID:1}},{limit:1});
        }
    }
    else {var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); //console.log(m);
         }
    
    var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    
    var t = m.time;
    return formatdate(t,type);
    //switch (type){
    //    case 'day':
    //        var out = months[t.getMonth()] + " " + t.getDate();
    //    break;
    //    case 'time2':
    //        if (t.getMinutes() == 0){var mins = "00";} else {var mins = t.getMinutes();}
    //        
    //        if (t.getHours()>=12) {var out = t.getHours()-12 + ":" + mins; return out + " PM"}
    //        else {var out = t.getHours() + ":" + mins; return out + " AM"} 
    //    break;
    //    case 'time':
    //        return moment(t).format('hh:mm [EDT]')
    //    break;    
    //}
    //return out
}


iscupover = function(year){
    var y = Cups.findOne({year:year,event:Session.get("currentevent")});
    if ((y.T1pts + y.T2pts) < y.ptsavailable) {return false}
    else {return true}
}



getMVP = function(year,defending){
    var event = Session.get('currentevent');
    var z = Rosters.findOne({year:parseInt(year),defending:parseInt(defending),event:event});
        var m = z.members; 
        var y= Members.findOne({event:'thecup'});
        return y
}


current = function(){
    return Meteor.user()
}
iscurrentUser = function(){
        return !(Meteor.user() == null)
    }

isAdmin = function(){
    // Grab current user, if not logged in, skip.
    var c = Cups.findOne({year:Session.get("selectedYear"),event:Session.get("currentevent")});
    
    // Grab current user, if not logged in, skip.
      if (Meteor.user() == null){return false}
      else if (Meteor.user().services.twitter !== undefined){
          var login = Meteor.user().services.twitter.screenName.toLowerCase();
      }
      else if (Object.keys(Meteor.user().emails).length > 0){
          var login = Meteor.user().emails[0].address.toLowerCase();
      }    
      else {return false}
    
      // Define administrators
      var exceptions = c.admins;
      if (exceptions.indexOf(login) >= 0) {return true;}// if not an admin
      else {return false}
    
}

isGlobalAdmin = function(){
    // Grab current user, if not logged in, skip.
    if (Meteor.user().services.twitter !== undefined){
          var login = Meteor.user().services.twitter.screenName;
      }
    else {var login=""; return false}
    
    return login == "TheCupKY" || login == 'thecupchampionship@gmail.com'
}

isscorekeeperEX = function (matchID){
      // Grab current user, if not logged in, skip.
      if (Object.keys(Meteor.user().services).length > 0){
          var login = Meteor.user().services.twitter.screenName;
      }
      else if (Object.keys(Meteor.user().emails).length > 0){
          var login = Meteor.user().emails[0].address;
      }    
      else {return false}
    
      // Define administrators
      var exceptions = ["TheCupKY","thecupchampionship@gmail.com"];
      if (exceptions.indexOf(login) >= 0) {out = true;}// if not an admin
      else {
      // Grant matchwise login access
      var out = false;
      var z = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
      var members = [z.P11, z.P12, z.P21, z.P22];    
      var cur = Members.find({name:{$in:members},event:Session.get("currentevent")});
      cur.forEach(function(x){
        if ([x.twitter,x.email].indexOf(login) >= 0) {out = true;}
      })
      }
      return out
}

scriptrunning = function(){
    return Session.get('scriptrunning');
}

getcourses = function(){
    return Courses.find({})
}

getNumber = function(theNumber)
{   
    if(theNumber > 0){
            return "+" + parseInt(theNumber);
        } else {
            return parseInt(theNumber);
        }
}

stampmatch = function(matchID,hole,flag){
        var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
        var d = new Date();
        eval('Matches.update({_id:y._id},{$set:{\'holes.h'+hole+'.time.actual\':d}});');
}

getaccess = function(){
    return Session.get("accessflag");
}

pausecomp = function(millis) 
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 

simulatematch = function(matchID){
    Session.set("scorekeepinghole",1);
    
    var iterations = 1;
    var interval = setInterval(foo, 1000);
    mm = Matches.findOne({matchID:matchID});
    function foo() {
                console.log('match '+mm.matchID+' hole'+iterations+' ran');
                Session.set('scriptrunning', true);
                Session.set("scorekeepinghole",iterations);
                var result = mm.result[iterations-1]; 
                eval('Matches.update({_id:mm._id},{$set:{\'holes.h'+iterations+'.result\':result}});');

                //Then do the slow stuff
                updatematch(mm.matchID,  'status');
                updatematch(mm.matchID,   'holes');  
                updatematch(mm.matchID,   'powers');  
                updatematch(mm.matchID,'predict2');
                snapshot(mm._id);
                if (iterations+1 < 19) {Session.set("scorekeepinghole",iterations+1)};
                Session.set('scriptrunning', false);
        
        iterations++;
        if (iterations > 17){
            clearInterval(interval);
        }
    }


}

resetexpectedtimes = function(){
        //this function resets matchholes (leaves results vector)
        //updatescup
        var mph = 15;
        var event = Session.get('currentevent');
        var year  = Session.get('selectedYear');
        var iyr = 100*(year-2000);
        var x = Matches.find({matchID:{$gt:iyr,$lt:iyr+100},event:event});
        x.forEach(function(m){
            var newtime = m.time; //comment
            for (var i=1;i<19;i++){
                newtime.setMinutes(newtime.getMinutes() + mph);
                eval('Matches.update({_id:m._id},{$set:{\'holes.h'+i+'.time.expected\':newtime}})');
            }
        })  
    }

pushhistoryE = function(){
    //run resetcup (admin click) before this, also resets expected finishing times
    //gather array of expected hole finishing times
    //sort array
    //increment along that array, find match holes with that time
    //take hole data, and insert history documents based on expected hole finish times
    var year = Session.get('selectedYear'); 
        var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')}); var unique = e.unique+(year-2000);
    
    var m = Matches.find({matchID:{$regex:unique},event:Session.get('currentevent')});
    var times = []; var time; var hole;
    m.forEach(function(x){
        for (var i=1;i<=18;i++){
            time = eval('x.holes.h'+i+'.time.expected');
            times.push(time);
        }
    })
    //sort array
    times = times.sort(); var mm;
    //console.log(times);
    
    
    var b = 00;
    var interval = setInterval(foo, 300);
    function foo() {
    //loop through times
    //for (var b=0;b<100;b++){
    //for (var b=0;b<times.length;b++){
        //loop through holes, finding matches with matching times
        var i = 0; var n = 2; var mm;
        for (var h=1;h<=18;h++){            
                mm = eval('Matches.find({\'holes.h'+h+'.time.expected\':times[b]});');
            // push
                mm.forEach(function(y){
                console.log('match '+y.matchID+' hole'+h+' ran at '+times[b]);
                //Quickly update the hole result
                var result = y.result[h-1];
                if (y.net !== undefined){var net = y.net[h-1];}
                if (result !== 2){    
                    eval('Matches.update({_id:y._id},{$set:{\'holes.h'+h+'.result\':parseInt(result),\'holes.h'+h+'.net\':parseInt(net),hole:parseInt(h)}});');
                    //CLIENT
                    if (y.type == 'stroke'){
                    Meteor.call('updatestroke',{matchID:y.matchID,event:Session.get('currentevent'),course:y.course});
                    var location = Geolocation.currentLocation();}
                    else {updatematch(y.matchID,'status');}
                           var location = Geolocation.currentLocation();
                    Meteor.call('snapshot',{type:y.type,matchID:y.matchID, time: eval('y.holes.h'+h+'.time.expected'), event:Session.get('currentevent'), user:Meteor.user(), latlong:[location.coords.latitude,location.coords.longitude,location.coords.accuracy]});
                }
                    
            })
        }
    //}
            b++;
            if (b > times.length-1){
                clearInterval(interval);
            }
        console.log('ran ', b);
    }
    
    
 
    
}
pushhistory = function(){
    //run resetcup (admin click) before this, also resets expected finishing times
    //gather array of expected hole finishing times
    //sort array
    //increment along that array, find match holes with that time
    //take hole data, and insert history documents based on expected hole finish times
    var yearidx = 100*(Session.get('selectedYear')-2000);
    var m = Matches.find({matchID:{$gt:yearidx,$lt:yearidx+100},event:Session.get('currentevent')});
    var times = []; var time; var hole;
    m.forEach(function(x){
        for (var i=1;i<=18;i++){
            time = eval('x.holes.h'+i+'.time.expected');
            times.push(time);
        }
    })
    //sort array
    times = times.sort(); var mm;
    //console.log(times);
    
    
    var b = 00;
    var interval = setInterval(foo, 300);
    function foo() {
    //loop through times
    //for (var b=0;b<100;b++){
    //for (var b=0;b<times.length;b++){
        //loop through holes, finding matches with matching times
        var i = 0; var n = 2; var mm;
        for (var h=1;h<=18;h++){            
                mm = eval('Matches.find({\'holes.h'+h+'.time.expected\':times[b]});');
            // push
                mm.forEach(function(y){
                console.log('match '+y.matchID+' hole'+h+' ran at '+times[b]);
                //Quickly update the hole result
                var result = y.result[h-1];
                if (result !== 2){    
                    eval('Matches.update({_id:y._id},{$set:{\'holes.h'+h+'.result\':result}});');
                    //CLIENT
                    updatematch(y.matchID,'status');
                    //SERVER
                    var location = Geolocation.currentLocation();
                    Meteor.call('updatematch',{matchID:y.matchID,event:Session.get("currentevent")},['points']);
                    Meteor.call('updatecup', {matchID:y.matchID,event:Session.get("currentevent")},['leads']);
                    
                    Meteor.call('snapshot',{type:y.type,matchID:y.matchID, time: eval('y.holes.h'+h+'.time.expected'), event:Session.get('currentevent'),user:Meteor.user(),latlong:[location.coords.latitude,location.coords.longitude,location.coords.accuracy]});
                }
                    
            })
        }
    //}
            b++;
            if (b > times.length-1){
                clearInterval(interval);
            }
        console.log('ran ',b);
    }
    
    
 
    
}

simulatecup = function(year){
    //gather array of expected hole finishing times
    //sort array
    //increment along that array, find match holes with that time
    var yearidx = 100*(year-2000);
    var m = Matches.find({matchID:{$gt:yearidx,$lt:yearidx+99},event:Session.get('currentevent')}); var times = []; var time; var hole;
    m.forEach(function(x){
        for (var i=1;i<=18;i++){
            time = eval('x.holes.h'+i+'.time.expected');
            times.push(time);
        }
    })
    //sort array
    times = times.sort(); var mm;
    //console.log(times);
    
    //loop through times
    //for (var b=0;b<100;b++){
    //for (var b=times.length-25;b<times.length-20;b++){
    var b = 00;
    var interval = setInterval(foo, 500);
    function foo() {
        //loop through holes, finding matches with matching times
        var i = 0; var n = 2; var mm;
        for (var h=1;h<=18;h++){            
                mm = eval('Matches.find({\'holes.h'+h+'.time.expected\':times[b]});');
            // simulate that hole on those matches
                mm.forEach(function(y){
                console.log('match '+y.matchID+' hole'+h+' ran at '+times[b]);
                //Quickly update the hole result
                Session.set('scriptrunning', true);
                Session.set("scorekeepinghole",h);
                var result = y.result[h-1]; 
                eval('Matches.update({_id:y._id},{$set:{\'holes.h'+h+'.result\':result}});');

                //Then do the slow stuff
                updatematch(y.matchID,  'status');
                updatematch(y.matchID,   'holes');  
                updatematch(y.matchID,   'powers');  
                updatematch(y.matchID,'predict2');
                snapshot(y._id);
                if (h+1 < 19) {Session.set("scorekeepinghole",h+1)};
                Session.set('scriptrunning', false);
                //sleep_until(3);    
            })
        }
        
        b++;
        if (b > times.length-1){
            clearInterval(interval);
        }
    }    
    //}
   
 
    
}

startbroadcast = function(params){
    
}

simulatehole = function(T1odds,T2odds){
    if (T1odds > 0) {var p1 = T1odds/100-0.5;}
    else {var p1 = -100/T1odds-0.5;}
    if (T2odds > 0) {var p2 = T2odds/100-0.5;}
    else {var p2 = -100/T2odds-0.5;}
    
    y = Math.random(1)-0.5; var status;
    
    if (y>p1/2){status = 1;}
    else {
        if (y<-p2/2){status = -1;}
        else {status = 0;}
    }
    return status
}

formatrecord = function(vector){
    var out = "";
    for (var i=0; i<vector.length;i++){
        out = out + vector[i];
        if (i<vector.length-1){out=out + "-";}
    }
    return out
}

getmatchstatement = function(matchID,name) {
    var iT; var s; var Pa; var oP; var resultverb; var teamflag;
    var m = Matches.findOne({matchID:matchID});
    if (m.P11 == name){iT =  1; Pa = m.P12; oP = m.P21+"/"+m.P22; teamflag = 1;}
    if (m.P12 == name){iT =  1; Pa = m.P11; oP = m.P21+"/"+m.P22; teamflag = 1;}
    if (m.P21 == name){iT = -1; Pa = m.P22; oP = m.P11+"/"+m.P12; teamflag = -1;}
    if (m.P22 == name){iT = -1; Pa = m.P21; oP = m.P11+"/"+m.P12; teamflag = -1;}
    var result = iT*m.status;
    if (result>0){
        s = 'KEY WIN: ';
        resultverb = 'defeated';  
    } else if (result == 0) {resultverb = 'tied'; s = 'KEY TIE: ';}
    else {s = 'CRUCIAL LOSS: '; resultverb = 'lost to';}
    
    
    switch (m.type){
            case 'singles':
                oP = oP.substring(0, oP.length-1);
                s = s + "In singles play, " + resultverb + " " + oP;
                break;
            case 'shamble':
                s = s + "In shamble with " + Pa + ", " + resultverb + " " + oP;
                break;
            case 'bestball':
                s = s + "In bestball with " + Pa + ", " + resultverb + " " + oP;
                break;
    }
    
     s = s + " " + getmatchstatus(matchID,teamflag) + ".";
     return s           
}

getsignificance = function(matchID,hole){
            var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); var status = 0;
            for (var i=1;i<=m.hole;i++){
               eval('curresult = m.holes.h'+i+'.result');
               if (curresult !== 2) {status = status + curresult;}
                else {break;}
            }
            var c = Cups.findOne({year:yridx,event:Session.get("currentevent")});                
            
}


getmatchstatus = function (matchID, teamflag){
    //this returns the status of a match as a string, if the team is winning
    //if it hasn't started (hole 0), then it prints the odds
    
    var x = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); var out;
    var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get("currentevent")})
    // determine number of match holes by whether or not that format gives points on the full match.
    if (eval('c.formats.'+x.type+'.points[2]')==0){var nHoles =9;} else {var nHoles = 18;}
    
        switch (x.hole){
            case 0: //if it hasn't started, print the odds
                out = x.T1odds;
                if (teamflag<0) {out=x.T2odds;}
                    if (out>0) {out = getNumber(out)}; //if its a number, format it
                break;
            default:
            if (x.status*teamflag > 0){//only bother if they are winning
              if (Math.abs(x.status)>(nHoles-x.hole) & x.hole<nHoles){out=Math.abs(x.status) + " & " + (nHoles-x.hole);} //if its over
              else {
                  out=Math.abs(x.status) + " UP";                   
              } //if its ongoing
          
            } else {out = "";}  
        
       }
    if (debug) {console.log('matchID: ' + matchID + ' teamflag: ' + teamflag + ' out: ' + out + ' nHoles: ' + nHoles + ' absstatus: ' + Math.abs(x.status))}
    return out
  },

yearsarray = function(){
    var c = Cups.find({event:Session.get('currentevent')},{sort:{year:-1}})
    var years = [];var i= 0;
    c.forEach(function(x){years[i] = x.year;i++;})
    return years
},
getcardinal = function(number) {
      number = parseInt(number)+1;
    //console.log('jts is',number);
    if (number == 1){return '1st';}
    if (number == 2){return '2nd';}
    if (number == 3){return '3rd';}
    if (number > 3) {return number+'th'}
},
rgb2rgba = function(str,a){
    var substring = "rgba("+str.substring(4,str.length-1)+"," + a + ")";
    //console.log(substring);
    return substring
},
stripOID = function(oid){
    if (oid[0] == "O") {oid = oid.substring(9,oid.length-1);}
    return oid
},
inarray = function(arr,str){
    var out = (arr.indexOf(str) > -1);
    //console.log('result'+out+'array'+arr+'str'+str);
    return out
},
getsession = function(str){
    return Session.get(str)
},
nextChar = function(c){
    return String.fromCharCode(c.charCodeAt(0) + 1);
  },
sumarray = function(elmt){
            var sum = 0;
            for( var i = 0; i < elmt.length; i++ ){
            sum += parseInt( elmt[i], 10 ); //don't forget to add the base
            }
            return sum
        }     
    

Handlebars.registerHelper('getmatchstatus', getmatchstatus);
Handlebars.registerHelper('getmatchstatement', getmatchstatement);
Handlebars.registerHelper('lastname', lastname);
Handlebars.registerHelper('firstinitiallastname', firstinitiallastname);
Handlebars.registerHelper('pluralize', pluralize);
Handlebars.registerHelper('formatdecimal',formatdecimal);
Handlebars.registerHelper('idx2year',idx2year);
Handlebars.registerHelper('subtract',subtract);
Handlebars.registerHelper('compare',compare);
Handlebars.registerHelper('isequal',isequal);
Handlebars.registerHelper('strcmp',strcmp);
Handlebars.registerHelper('isteammatch',isteammatch);
Handlebars.registerHelper('getNumber',getNumber);
Handlebars.registerHelper('isglobalscorekeeper',isglobalscorekeeper);
Handlebars.registerHelper('isscorekeeper',isscorekeeper);
Handlebars.registerHelper('getaccess',getaccess);
Handlebars.registerHelper('formatrecord',formatrecord);
Handlebars.registerHelper('multiply',multiply);
Handlebars.registerHelper('add',add);
Handlebars.registerHelper('formattwitter',formattwitter);
Handlebars.registerHelper('isscorekeeperEX',isscorekeeperEX);
Handlebars.registerHelper('iscupover',iscupover);
Handlebars.registerHelper('getMVP',getMVP);
Handlebars.registerHelper('scriptrunning',scriptrunning);
Handlebars.registerHelper('simulatecup',simulatecup);
Handlebars.registerHelper('simulatematch',simulatematch);
Handlebars.registerHelper('pausecomp',pausecomp);
Handlebars.registerHelper('isAdmin',isAdmin);
Handlebars.registerHelper('isGlobalAdmin',isGlobalAdmin);
Handlebars.registerHelper('addmatch',addmatch);
Handlebars.registerHelper('getteetime',getteetime);
Handlebars.registerHelper('formatdate',formatdate);
Handlebars.registerHelper('aggregatememberstats',aggregatememberstats);
Handlebars.registerHelper('stampmatch',stampmatch);
Handlebars.registerHelper('standardDeviation',standardDeviation);
Handlebars.registerHelper('variance',variance);
Handlebars.registerHelper('iscurrentUser',iscurrentUser);
Handlebars.registerHelper('getcups',getcups);
Handlebars.registerHelper('iscurrentyear',iscurrentyear);
Handlebars.registerHelper('current',current);
Handlebars.registerHelper('updatecuprecord',updatecuprecord);
Handlebars.registerHelper('cupinfo',cupinfo);
Handlebars.registerHelper('getcurrentevent',getcurrentevent);
Handlebars.registerHelper('yearsarray',yearsarray);
Handlebars.registerHelper('eventinfo',eventinfo);
Handlebars.registerHelper('getslideryears',getslideryears);
Handlebars.registerHelper('abs',abs);
Handlebars.registerHelper('getdate',getdate);
Handlebars.registerHelper('rgb2rgba',rgb2rgba);
Handlebars.registerHelper('stripOID',stripOID);
Handlebars.registerHelper('inarray',inarray);
Handlebars.registerHelper('addarray',addarray);
Handlebars.registerHelper('getsession',getsession);
Handlebars.registerHelper('resetexpectedtimes',resetexpectedtimes);
Handlebars.registerHelper('pushhistory',pushhistory);
Handlebars.registerHelper('getcardinal',getcardinal);
Handlebars.registerHelper('getcourses',getcourses);
Handlebars.registerHelper('nextChar',nextChar);
Handlebars.registerHelper('startbroadcast',startbroadcast);
Handlebars.registerHelper('sumarray',sumarray);
Handlebars.registerHelper('parseteamname',parseteamname);
Handlebars.registerHelper('isdayaccessopen',isdayaccessopen);
Handlebars.registerHelper('uppercase',uppercase);



var DIMENSIONS = {
  small: '320x350',
  large: '640x480',
  full: '640x800'
};

UI.registerHelper('recipeImage', function(options) {
  var size = options.hash.size || 'large';

  if (options.hash.recipe)
    return '/img/recipes/' + DIMENSIONS[size] + '/' + options.hash.recipe.name + '.jpg';
});

Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var routeNames = arguments;

  return _.include(routeNames, Router.current().route.name) && 'active';
});

//Insert document into History collection containing a snapshot of information from the instance the function is called
snapshot = function(match_id) {
    var screenName;
    if (Meteor.user() == null) {screenName = "";}
    else { if (Meteor.user().services.twitter == undefined) {screenName == Meteor.user().emails[0].address;}
           else {screenName = Meteor.user().services.twitter.screenName;}
         }
    var location = Geolocation.currentLocation();
    if (location == null || location == undefined){
          var lat = null; var long = null; var accuracy = null; var time = null; var speed = null;
    }
    else {var lat = location.coords.latitude;
          var long = location.coords.longitude;
          var accuracy = location.coords.accuracy; 
          var time = location.timestamp; 
          var speed = location.coords.speed;
         }
    
    var match    = Matches.findOne({_id:match_id});
    var d = new Date();
        if (match.matchID > 0){var event    = Cups.findOne({year:2000+parseInt(match.matchID/100),event:Session.get("currentevent")});}
        else                  {var event    = Exhibitions.findOne({unique:match.matchID[0],event:Session.get("currentevent")});}
    var location = { "type": "Point",
                     "coordinates": [lat+Math.random(), long+Math.random()],
                     "time":d,
                     "accuracy":accuracy,
                     "speed":speed,
                   };
    eval('Matches.update({_id:match_id},{$set:{\'holes.h'+match.hole+'.time.actual\':d,\'holes.h'+match.hole+'.location\':location}});');
    History.insert({"location": location,
                    "user":screenName,
                    "matchID": match.matchID,
                    "match_status": match.status,
                    "match_hole": match.hole,
                    "event_id": event._id,
                    "event_status": [event.T1pts, event.T2pts],
                    "event_leads": [event.T1leads, event.T2leads, event.ties]
                   }
                  );
}

getNET = function(index,course,hole,result){
    var c = Courses.findOne({description:course});
    holehandicap = c.handicap[hole-1];
    if (index < 0) {if (-1*index>(18-holehandicap)){var adjust=-1;} else {var adjust = 0;}}
    if (index <= 18 & index>=0) {var adjust = (index>=holehandicap);}
    if (index > 18) {var adjust = 1+((index-18)>=holehandicap);}
    return result - adjust
}


updatestroke = function(matchID) {
    var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});
    var z = Courses.findOne({description:y.course});
    var status = 0; var net = 0; var h;
    for (var i=0;i<18;i++){
        if (y.result[i] == "N") {}
        else {
        status = status + (y.result[i]-z.par[i]);
        net =    net + (   y.net[i]-z.par[i]);
        h = i;
        }
    }
    Matches.update({_id:y._id},{$set:{status:status,netstatus:net,hole:h+1}});
}

//update the status of a match.
updatestatus = function(matchID,type) {
    // Update match status and hole number, run through status array
    //var y = Matches.findOne({matchID:matchID}); id = y._id; var h; var cumstatus = 0;
    //for (h = 0; h<18; h++){if (y.result[i] < 2) {cumstatus = cumstatus + parseInt(y.result[h]);} 
    //                           else {break;}
    //                          }
    //Matches.update(id,{$set:{status:cumstatus,hole:h}});
    
    //cursor = Matches.find({}, {sort: {matchID: -1} }); //JTSHERE
    //cursor.forEach(function(x){console.log(x.matchID + " --- "); updatematch(x.matchID,'powers');})
    //updatematch(812,'powers');
    //updatememberstats('all','bestballpoints');
    //updatememberstats('all','shamblepoints');
    //updatememberstats('all','draftperc'); 
    //cursor = Matches.find({}, {sort: {matchID: -1} }); //JTSHERE
    //cursor.forEach(function(x){console.log(x.matchID + " --- "); updatematch(x.matchID,'powers');})
    
    
    
    //updatememberstats('all','bestballpoints');
    //updatememberstats('all','shamblepoints');
    //var yr = 2014; type = 'bestballperc';
    //updateteamstats(type,yr,0); updateteamstats(type,yr,1);
    //var yr = 2013; 
    //updateteamstats(type,yr,0); updateteamstats(type,yr,1);
    //var yr = 2012; 
    //updateteamstats(type,yr,0); updateteamstats(type,yr,1);
    //var yr = 2011;
    //updateteamstats(type,yr,0); updateteamstats(type,yr,1);
    //rNkMPyS8vC3KZ7hWv
    
    //SITUATIONAL ACTIONS
    //updatememberstats('all','power'); //ON PT CHANGE WITHIN MAP
    //compilestat('summit');
    
    //updatememberstats('power','Jay Sutton');
}



compilestat = function(type){
    switch(type){
    case 'summit':
        var cumpoints = 0; cumavail = 0;
        var summitmembers = ["Bret Stephens","Nick Ramler","Alex Rechtin","Andy Wulfeck","Erik Wulfeck","Jason Wulfeck","Mike Stephens","Tony Bickel"]
        var y = Members.find({name:{$in:summitmembers},event:Session.get("currentevent")});
        y.forEach(function(x){
            cumpoints = cumpoints+x.singlespoints.y2015+x.shamblepoints.y2015+x.bestballpoints.y2015;
            cumavail = cumavail+8;
        })
        //console.log('cumpoints:' + cumpoints + 'cumavail:' + cumavail);
    break;
    }
}

updatecup = function(matchID, type){
    var year = parseInt(matchID/100)+2000;
    var cup = Cups.findOne({year:year,event:Session.get("currentevent")});
    //console.log(matchID);
    switch(type){
    case 'points':
        //update points in bulk fashion
        var yridx = (year-2000)*100; var T1pts = 0; var T2pts = 0; 
        var T1ptsDAY = [0,0,0]; var T2ptsDAY = [0,0,0]; var matchtype; var names;
        var cursor = Matches.find({matchID:{$gt:yridx,$lt:yridx+100},event:Session.get("currentevent")});
        cursor.forEach(function(m){
            T1pts = T1pts + m.T1pts; T2pts = T2pts + m.T2pts;
            T1ptsDAY[m.day-1]= T1ptsDAY[m.day-1]+m.T1pts;
            T2ptsDAY[m.day-1]= T2ptsDAY[m.day-1]+m.T2pts;
        })
        Cups.update({_id:cup._id},{$set:{T1pts:T1pts,T2pts:T2pts, T1ptsDAY:T1ptsDAY, T2ptsDAY:T2ptsDAY}});

        updatematch(matchID,'powers');
        updatematch(matchID,'holes');
        var y = Matches.findOne({matchID:matchID,event:Session.get("currentevent")});  
        updatememberstats([y.P11,y.P12,y.P21,y.P22],'power');
        switch (y.type){
          case 'singles':
            updatememberstats([y.P11, y.P21],'singlespoints');
            updatememberstats([y.P11, y.P21],'power');
            updatememberstats([y.P11, y.P21],'winperc');
          break;
          case 'shamble':
                //console.log([y.P11,y.P12, y.P21, y.P22]);
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'shamblepoints');
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'power');
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'winperc');
          break;
          case 'bestball':
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'bestballpoints');
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'power');
            updatememberstats([y.P11,y.P12, y.P21, y.P22],'winperc');
          break;
        }
        // if the cup is over
        if (0){
        //if ( iscupover(year) ){    
          updateteamstats('winperc',year,1);
          updateteamstats('singlesperc',year,1);
          updateteamstats('shambleperc',year,1);
          updateteamstats('singlesperc',year,1);
          updateteamstats('tenure',year,1);
          updateteamstats('power',year,1);
          updateteamstats('impact',year,1);

          updateteamstats('winperc',year,0);
          updateteamstats('singlesperc',year,0);
          updateteamstats('shambleperc',year,0);
          updateteamstats('singlesperc',year,0);
          updateteamstats('tenure',year,0);
          updateteamstats('power',year,0);
          updateteamstats('impact',year,0);
        }
    break;
    case 'leads': //also does projected points
        //update points in bulk fashion
        var e = Events.findOne({description:Session.get("currentevent")});
        var yridx = (year-2000)*100; var T1pts = 0; var T2pts = 0; 
        var T1predict = 0; var T2predict = 0;
        var T1leads = 0; var T2leads = 0; var ties = 0;
        var cursor = Matches.find({matchID:{$gt:yridx,$lt:yridx+100},event:Session.get("currentevent")},{sort:{matchID:1}});
        cursor.forEach(function(m){
            T1pts = T1pts + m.T1pts; T2pts = T2pts + m.T2pts;
            // Update leads + ties            
            var ptsavail = eval('e.formats.'+m.type+'.points');
            ptsavail = ptsavail[0]+ptsavail[1]+ptsavail[2];
            
            var ptsrem = (ptsavail-(m.T1pts+m.T2pts));
            if (m.status >0){var f1 = 1; var f2 = 0; T1leads = T1leads + (ptsrem>0 & m.hole>0); //console.log('t1'+ (ptsrem>0 & m.hole>0));
                            }
            if (m.status <0){var f1 = 0; var f2 = 1; T2leads = T2leads + (ptsrem>0 & m.hole>0); //console.log('t2'+ (ptsrem>0 & m.hole>0));
                            }
            if (m.status==0){var f1 = 0.5; var f2 = 0.5; ties = ties + (ptsrem>0 & m.hole>0); //console.log('tie'+ (ptsrem>0 & m.hole>0));
                            }
            T1predict = m.T1pts + T1predict + f1*ptsrem; 
            T2predict = m.T2pts + T2predict + f2*ptsrem;
            //console.log(m.matchID + " " + f1*ptsrem + " " + f2*ptsrem)
            
        })
        Cups.update({_id:cup._id},{$set:{T1leads:T1leads,T2leads:T2leads,ties:ties,T1predict:T1predict,T2predict:T2predict}});
    break;
    }//end switch
}

updatematch = function(matchID,type){
        var cursor2 = Matches.find({matchID:matchID,event:Session.get("currentevent")});
        cursor2.forEach(function(y){
        //console.log('MatchType:'+y.type+' | matchID' + matchID);
        //console.log('P11:'+y.P11);
        //console.log('P12:'+y.P12);
        //console.log('P21:'+y.P21);
        //console.log('P22:'+y.P22);
    switch (type){       
    case 'status':
        // Update overall match status(es), call cupleads and match points function
        id = y._id; var h; var cumstatus = 0;var currres;var H = 0;
        for (h = 1; h<=18; h++){curres = eval('y.holes.h'+h+'.result');
                                if (curres<2) {cumstatus = cumstatus + parseInt(curres); H++;} 
                                   else {
                                        //break;
                                   }
                                }    
        eval('Matches.update({_id:id},{$set:{status:cumstatus,hole:(H),\'holes.h'+(H)+'.status.all\':cumstatus}});');
        
            // Update overall match status and hole number, run through status array
            var statusF9 = 0; var statusB9 = 0; 
            
            var HoleTest = [3,4,5,6,7,8,9,1,2];
//            HoleTest.forEach(function(H){
//                curres = eval('y.holes.h'+H+'.result');
//                if (curres<2) {statusF9 = statusF9 + parseInt(curres);} 
//                else {
//                    //break;
//                }            
//            }) 
            
            for (h = 1; h<=9; h++){curres = eval('y.holes.h'+h+'.result');
                                   if (curres<2) {statusF9 = statusF9 + parseInt(curres);} 
                                   else {
                                       //break;
                                   }
                                  }
            for (h = 10; h<=18; h++){curres = eval('y.holes.h'+h+'.result');
                                     if (curres<2) {statusB9 = statusB9 + parseInt(curres);} 
                                     else {break;}
                                    }
        eval('Matches.update({_id:id},{$set:{statusF9:statusF9,statusB9:statusB9,\'holes.h'+h+'.status.f9\':statusF9,\'holes.h'+h+'.status.b9\':statusB9}});');  
        break;
    case 'points':
            //this needs to be rewritten from server helper.js
        var year = Session.get('selectedYear');   
        var event = Session.get("currentevent");    
        var e = Cups.findOne({year:year,event:event});
        var ptsavail = eval('e.formats.'+y.type+'.points');
            
        // update match points for 18 hole match, if pts change, ask for cup points update
        var T1pts = 0; var T2pts = 0; var T1ptsO = y.T1pts; var T2ptsO = y.T2pts; var active=1;
        if (Math.abs(y.status)>(18-y.hole) | y.hole == 18){
            if (y.status>0){T1pts = T1pts + ptsavail[2];T2pts = T2pts + 0;}
            if (y.status<0){T1pts = T1pts + 0;T2pts = T2pts + ptsavail[2];}
            if (y.status==0){T1pts = T1pts + ptsavail[2]/2;T2pts = T2pts + ptsavail[2]/2;}
        }
        if (Math.abs(y.statusF9)>(9-y.hole) | y.hole == 9){
            if (y.statusF9>0){T1pts = T1pts + ptsavail[0];T2pts = T2pts + 0;}
            if (y.statusF9<0){T1pts = T1pts + 0;T2pts = T2pts + ptsavail[0];}
            if (y.statusF9==0){T1pts = T1pts + ptsavail[0]/2;T2pts = T2pts + ptsavail[0]/2;}
        }
        if (Math.abs(y.statusB9)>(18-y.hole) | y.hole == 18){
            if (y.statusB9>0){T1pts = T1pts + ptsavail[1];T2pts = T2pts + 0;}
            if (y.statusB9<0){T1pts = T1pts + 0;T2pts = T2pts + ptsavail[1];}
            if (y.statusB9==0){T1pts = T1pts + ptsavail[1]/2;T2pts = T2pts + ptsavail[1]/2;}
            //console.log('enteredb9' + y.statusB9);
        }
            
        if (sumarray(ptsavail)==(T1pts+T2pts) || y.hole==0){var active = 0;} else {var active = 1;}
            //console.log('UpdateMatch, Points: active'+active + 'ptsavail'+sumarray(ptsavail)+'totalpts'+(T1pts+T2pts));
        Matches.update({_id:y._id},{$set:{T1pts:T1pts,T2pts:T2pts,active:active}})
        if (Math.abs(T1pts-T1ptsO)>0 | Math.abs(T2pts-T2ptsO)>0){
            Meteor.call('updatecup',{event:event,matchID:y.matchID},['points']); 
            
            //Meteor.call('updatematch',{event:info.event,matchID:y.matchID},'holes');
        }   
        break;       
            
    case 'holes':
        var x = Courses.findOne({description:y.course});
        var pars = x.par; var p3 = [0,0,0]; var p4 = [0,0,0]; var p5 = [0,0,0]; var result = y.result;
            //console.log(y);
        for (var h = 1; h<=18; h++){
            result = eval('y.holes.h'+h+'.result');
            if (result== 2){break;}
            if (result== 1){eval('p'+pars[h-1]+'[0]=p'+pars[h-1]+'[0]+1');}
            if (result==-1){eval('p'+pars[h-1]+'[1]=p'+pars[h-1]+'[1]+1');}
            if (result== 0){eval('p'+pars[h-1]+'[2]=p'+pars[h-1]+'[2]+1');}
        }
        Matches.update({_id:y._id},{$set:{'record.par3':p3,'record.par4':p4,'record.par5':p5}})    
        break; 
    case 'predict':
            var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); 
            //console.log(matchID);
            var p = Members.findOne({name:m.P11,event:Session.get("currentevent")});
            var pwrT1 = p.stats.power;
                p = Members.findOne({name:m.P21,event:Session.get("currentevent")});
            var pwrT2 = p.stats.power;
            
            if (m.type !== "singles"){
            var p = Members.findOne({name:m.P12,event:Session.get("currentevent")});
                pwrT1 = pwrT1 + p.stats.power; pwrT1 = pwrT1/2;
                p = Members.findOne({name:m.P22,event:Session.get("currentevent")});
                pwrT2 = pwrT2 + p.stats.power; pwrT2 = pwrT2/2;
            }
            
            var dP = pwrT1 - pwrT2; var dH = dP/50; 
            for (var i=0;i<18;i++){
                if (Math.abs(dH*(i+1)) > (17-i)){
                    var predict = [dH*(i+1), (17-i)];
                    break;
                }
            }
            
            //console.log('HoleDiff: ' + dH + 'Predict: ' + dH*18);
            Matches.update({_id:m._id},{$set:{'stats.dH':dH*18,'stats.predict':predict}}); 
            break; 
    case 'predict2':
            var m = Matches.findOne({matchID:matchID,event:Session.get("currentevent")}); 
            var c = Cups.findOne({year:2000+parseInt(matchID/100),event:Session.get("currentevent")})
            
            //Get current cup status, and match points: c.T1pts, c.T2pts
            var predictedstatus = [c.T1pts, c.T2pts];
            var matchpts = eval('c.matchvalues.'+m.type) - (m.T1pts + m.T2pts); 
            
            //if the match is still going
            if (matchpts){
            //if T1 wins next hole
            //if they would be ahead enough to take all the points
            if ((m.status+1) > (18-(m.hole+1))){predictedstatus[0] = predictedstatus[0] + matchpts;}
            //if they would be dormie
            else if ((m.status+1) == (18-(m.hole+1))){predictedstatus[0] = predictedstatus[0] + matchpts/2;}
            
            //if T1 wins next hole
            //if they would be ahead enough to take all the points
            if ((m.status-1) < ((m.hole+1)-18)){predictedstatus[1] = predictedstatus[1] + matchpts;}
            //if they would be dormie
            else if ((m.status-1) == ((m.hole+1)-18)){predictedstatus[1] = predictedstatus[1] + matchpts/2;}
            }
            
            //print max vector to match object in h*.event.predict, and predict
            eval('Matches.update({\'_id\':m._id},{$set:{\'holes.h'+m.hole+'.event.predict\':predictedstatus,\'predict\':predictedstatus}})');
            break; 
    case 'powers':
        var E = 5; 
            var e = Events.findOne({description:Session.get('currentevent')});
            var cumpowers = 0; var cummatches = 0;
            var powers = 0; var matches = 0; var power;
                //console.log('entered match powers');
                var DPp; var DPo; var DPt; var WL; var DP11; var DP12=0; var DP21; var DP22=0;
                var ptsavail = eval('e.formats.'+m.type+'.points');
                    ptsavail = ptsavail[0]+ptsavail[1]+ptsavail[2];
            
                    var T1count = 1;var T2count = 1;
                    //console.log('entered match powers shamble' + y);
                    //console.log(y.P11+y.P12+y.P21+y.P22);
                    var pgive = y.T1pts + y.T2pts;
                    if (pgive){ //if points have been given
                    var year = parseInt(matchID/100)+2000;
                    WL1 = y.T1pts/(pgive)*ptsavail-1; WL2 = y.T2pts/(pgive)*2-1;
                    var z = Members.findOne({name:y.P11}); 
                    eval('DP11=z.draftperc.y'+year);
                    var z = Members.findOne({name:y.P12}); 
                    if (z !== undefined){eval('DP12=z.draftperc.y'+year);T1count++;}
                    var z = Members.findOne({name:y.P21}); 
                    eval('DP21=z.draftperc.y'+year);
                    var z = Members.findOne({name:y.P22}); 
                    if (z !== undefined){eval('DP22=z.draftperc.y'+year);T2count++;}
                    
                                               
                    DPp = (DP11+DP12)/T1count; DPo = (DP21+DP22)/T1count; 
                        if (DPo>DPp) {var T1ch = WL1*(WL1>WL2)*Math.abs(  DPo-DPp);}
                        if (DPp>=DPo) {var T1ch = WL1*(WL2>WL1)*Math.max(0,DPp-DPo);}
                                                //console.log("DP11" + DP11 + " : " + T1ch + " : " + WL1 + " : " + E); console.log(DP11+T1ch+WL1*E); 
                                                //console.log("DP12" + DP12 + " : " + T1ch + " : " + WL1 + " : " + E); console.log(DP12+T1ch+WL1*E);
                    Matches.update({_id:y._id},{$set:{'stats.powerP11':DP11+T1ch+WL1*E}});
                    if (T1count>1){Matches.update({_id:y._id},{$set:{'stats.powerP12':DP12+T1ch+WL1*E}});}
                                                
                    DPp = (DP21+DP22)/2; DPo = (DP11+DP12)/2;                             
                    if (DPo>DPp) {var T2ch = WL2*(WL2>WL1)*Math.abs(  DPo-DPp);}
                    if (DPp>=DPo) {var T2ch = WL2*(WL1>WL2)*Math.max(0,DPo-DPp);}
                                                //console.log("DP21" + DP21 + " : "); console.log(DP21+T2ch+WL2*E);
                                                //console.log("DP22" + DP22 + " : "); console.log(DP22+T2ch+WL2*E);
                    Matches.update({_id:y._id},{$set:{'stats.powerP21':DP21+T2ch+WL2*E}});
                    if (T2count>1){Matches.update({_id:y._id},{$set:{'stats.powerP22':DP22+T2ch+WL2*E}});}
                    } //if points haven't been given, set all to zero
                    else {Matches.update({_id:y._id},{$set:{'stats.powerP11':0,'stats.powerP12':0,'stats.powerP21':0,'stats.powerP22':0}});}
            
    break;
    
    } //end switch
     })                  
} //end function

updateteamstats = function(type,year,defending){
    //console.log('found function');
    //console.log(type+" "+ year+" "+defending);
    var y = Rosters.findOne({year:year, defending:defending, event:Session.get("currentevent")}); var members; var cursor2; var ID;
    //console.log(y);
       //console.log('found roster');
       members = y.members; ID = y._id;
        //console.log(members);
       cursor2 = Members.find({name:{$in:members}})

    
    var value = 0; var k = 0;
    cursor2.forEach(function(x){
    switch (type) {
    case 'winperc':
            value = value + x.stats.winperc; k++;
            break;
    case 'singlesperc':
            value = value + x.stats.singlesperc; k++;
            break;
    case 'bestballperc':
            value = value + x.stats.bestballperc; k++;
            break;
    case 'shambleperc':
            value = value + x.stats.shambleperc; k++;
            break;
    case 'tenure':
            value = value + x.stats.tenure; k++;
            break;
    case 'power':
            //console.log(x.name + "PWR: " + x.stats.power);
            value = value + x.stats.power; k++;
            break;
    case 'impact':
            //console.log(x.name + "IMP: " + x.stats.impact);
            if (x.stats.impact !== NaN){
            value = value + x.stats.impact; k++;
            }
            break;
    case 'draftperc':
            value = value + x.stats.draftperc; k++;
            break;
    }  //end switch
    }) //end forEach2        
    
    eval("Rosters.update({_id:ID},{$set:{\"stats."+type+"\":value/k}})");
    //console.log('found update');      
}

updatememberstats = function(id,type){
    if (id == "all") {var cursor = Members.find({event:Session.get('currentevent')});}
    else {var cursor = Members.find({name:{$in:id},event:Session.get('currentevent')});}
    //console.log('entered memberstats');
    console.log(id);
    
    //JTS HERE -- SOME MEMBERS DON"T HAVE ALL DRAFT POSITIONS (SEE BRET 2008)
    switch (type) {
    case 'draftPos2':
            cursor.forEach(function(x){
                for (var year=2007;year<2017;year++){
                    if (eval("x.draftPos"+year)>-1){
                        //console.log(eval("x.draftPos"+year));
                        var pos = eval("x.draftPos"+year);
                        eval("Members.update({_id:\""+x._id+"\"},{$set:{\"draftPos2.y"+year+"\":"+pos+"}});");
                                                  }
                }
            })
            break;
    case 'draftperc':
        var years = yearsarray(); years = years.reverse();
        cursor.forEach(function(x){
            var draftpercs = 0; var k = 0; var fieldsize;
            for (var i = 0; i<years.length; i++){
                var year = years[i];
                //if (typeof eval("x.draftPos2.y" + i) !== 'undefined') {
                var r = Rosters.findOne({year:year,event:Session.get("currentevent"),members:{$in:[x.name]}});
                if (eval("x.active.y" + year) & r !== undefined) {  
                    fieldsize = 2*r.members.length-2; 
                    var currdraftPos = eval("x.draftPos2.y"+year);
                    var currdraftperc = 100*(1-(currdraftPos-1)/fieldsize);                              
                    // Give non-2007 captains the previous year's draftperc. Give inaugural captains a 70.
                    if (currdraftperc > 100 && i>0) {
                        eval('currdraftperc = x.draftperc.y'+years[i-1]);
                        //console.log(x.name+i + " : " + eval('x.draftperc.y'+(i-1)))
                    }
                    if (currdraftperc > 100 && i==0) {
                        currdraftperc=70;
                        //console.log(x.name+i + " : " + eval('x.draftperc.y'+(i-1)))
                    }         
                    //Members.update({_id:x._id}, { $set: {draftperc.y2011: 100*(1-x.draftPos2[0].y2011)/fieldsize } } )
                }
                else {currdraftperc = "N"}
                
                //update the draftperc
                if (currdraftperc >-1) {draftpercs = draftpercs + currdraftperc; k++;
                    eval("Members.update({_id:x._id}, { $set: {\"draftperc.y"+year+"\":"+currdraftperc+"  } } )");
                } 
                else {eval("Members.update({_id:x._id}, { $set: {\'draftperc.y"+year+"\':0  } } )");}
                console.log(year+x.name+currdraftperc) 
            }
            Members.update({_id:x._id}, { $set: { "stats.draftperc": draftpercs/k } } );
        //console.log(x.powers[0].y2014[0].Commissioner);
        //Members.update({_id:x._id}, { $set: { "stats.draftperc": Object.keys(x.draftPos2[0]).length } } )
        })
    break; 
    case 'tenure':
        console.log("TENURE")     
        cursor.forEach(function(x){
        //console.log(x.powers[0].y2014[0].Commissioner);
            var tenure = Object.keys(x.draftPos2).length;
            Members.update({_id:x._id}, { $set: { "stats.tenure": tenure } } );
            console.log(x.name+tenure); 
        })
        
    break;
    case 'power':
        //Grabs match powers and computes member powers.
        console.log("POWER");
        var years = yearsarray(); years = years.reverse();
        cursor.forEach(function(x){
            //console.log(x.name);
            var cumpowers = 0; var cumyears = 0; var cumimpact = 0;
        for (var i=0; i<years.length;i++){
            var year = years[i];
            var powers = 0; var matches = 0; var yearidx = 100*(year-2000); var ID; var power = 0;
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name},{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}}],event:Session.get("currentevent") });
            cursor2.forEach(function(y){
                if (y.hole>0) {
                    if (x.name == y.P11){power = y.stats.powerP11;}
                    if (x.name == y.P12){power = y.stats.powerP12;}
                    if (x.name == y.P21){power = y.stats.powerP21;}
                    if (x.name == y.P22){power = y.stats.powerP22;}
                    powers = powers + power; matches++;
                }
                //console.log(power + " " + matches);
            })
            if (matches>0) {var avgpower = powers/matches;cumyears++;cumpowers = cumpowers + avgpower;}
            else {
                var avgpower = eval('x.draftperc.y'+year);
            }
            
            
            //console.log("y"+idx+":"+avgpower);
            eval("Members.update({_id:x._id}, { $set: {\"powers.y"+year+"\":avgpower  } } )");
            
            var impact;
            impact = eval('x.draftperc.y'+year);
            impact = avgpower-impact;
            cumimpact = cumimpact + impact;
            //console.log("impact"+idx+":"+impact);
            eval("Members.update({_id:x._id}, { $set: {\"impacts.y"+year+"\":impact  } } )");
            
            console.log(x.name + year + "impact" + impact);
            console.log(x.name + year + "power" + avgpower);
        } //end for years
            var avgcumpower = cumpowers/cumyears; 
            if (!isNaN(avgcumpower)) {Members.update({_id:x._id}, { $set: { "stats.power": avgcumpower } } );}
            else {var avgcumpower = "N";Members.update({_id:x._id}, { $set: { "stats.power": "N" } } );}
            //console.log(avgcumpower);
        
        Members.update({_id:x._id}, { $set: { "stats.impact": cumimpact } } );
        console.log(x.name + "Fimpact" + cumimpact);
        console.log(x.name + "Fpower" + avgcumpower);
        })
    break;
    case 'power2'://for individual matches
        var E = 5;
        var years = yearsarray(); years = years.reverse();  
        cursor.forEach(function(x){
            var cumpowers = 0; var cummatches = 0;
       for (var idx = 0; idx<years.length; idx++){
            var year = years[idx]; var powers = 0; var matches = 0; var yearidx = 100*(year-2000); var ID; var power;
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}}] });
            cursor2.forEach(function(y){
                var DPp; var DPo; var DPt; var WL;
                ID = y._id;
                DPp = x.draftperc.y2015;
                if (y.type == 'singles') {
                    DPt = x.draftperc.y2015; 
                    WL = y.T1pts/2 * 2 - 1;
                    var cursor3 = Members.find({name:y.P21,event:Session.get("currentevent")}); 
                    cursor3.forEach(function(z){DPo=z.draftperc.y2015;});
                }
                if (y.type == 'shamble') {
                    var cursor3 = Members.find({name:y.P12,event:Session.get("currentevent")}); cursor3.forEach(function(z){DPt = (x.draftperc.y2015+z.draftperc.y2015)/2});
                    WL = y.T1pts/4 * 2 - 1;
                    var cursor3 = Members.find({name:y.P21,event:Session.get("currentevent")}); 
                    cursor3.forEach(function(z){DPo=z.draftperc.y2015;});
                    var cursor3 = Members.find({name:y.P22,event:Session.get("currentevent")}); 
                    cursor3.forEach(function(z){DPo=(DPo+z.draftperc.y2015)/2});
                }
                if (y.type == 'bestball') {
                    var cursor3 = Members.find({name:y.P12,event:Session.get("currentevent")}); cursor3.forEach(function(z){DPt = (x.draftperc.y2015+z.draftperc.y2015)/2});
                    WL = y.T1pts/2 * 2 - 1;
                    var cursor3 = Members.find({name:y.P21,event:Session.get("currentevent")}); 
                    cursor3.forEach(function(z){DPo=z.draftperc.y2015;});
                    var cursor3 = Members.find({name:y.P22,event:Session.get("currentevent")}); 
                    cursor3.forEach(function(z){DPo=(DPo+z.draftperc.y2015)/2});
                }
                
                power = DPp + (WL)*(DPo-DPt) + WL*E;
                powers = powers + power; matches++;
            
            
            })
            
            
            
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 2;})
            
            
            
            
            eval("Members.update({_id:x._id}, { $set: { \"singlespoints.y"+year+"\": points } } )");
            eval("Members.update({_id:x._id}, { $set: { \"singlesperc.y"+year+"\": 100*points/avail } } )");
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
        }
        Members.update({_id:x._id}, { $set: { "stats.singlespoints": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.singlesperc": 100*cumpoints/cumavail } } );
        })
    break;
    case 'singlespoints':
        cursor.forEach(function(x){
            var cumpoints = 0; var cumavail = 0;
        for (var idx = 2007; idx<2017;idx++){
            var points = 0; var avail = 0; var yearidx = 100*(idx-2000);
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'singles'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + 2;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'singles'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 2;})
            if (avail == 0){var perc = 'N';} 
                else {var perc = 100*points/avail;}
            eval("Members.update({_id:x._id}, { $set: { \"singlespoints.y"+idx+"\": points } } )");
            eval("Members.update({_id:x._id}, { $set: { \"singlesperc.y"+idx+"\": perc } } )");
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
        }
        if (cumavail == 0){var perc = 'N';} 
            else {var perc = 100*cumpoints/cumavail;}
            
        Members.update({_id:x._id}, { $set: { "stats.singlespoints": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.singlesperc": perc } } );
        })
    break;
    case 'bestballpoints':
        cursor.forEach(function(x){
            var cumpoints = 0; var cumavail = 0;
        for (var idx = 2007; idx<2017;idx++){
            var points = 0; var avail = 0; var yearidx = 100*(idx-2000);
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'bestball'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + 2;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'bestball'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 2;})
            if (avail == 0){var perc = 'N';} 
                else {var perc = 100*points/avail;}
            eval("Members.update({_id:x._id}, { $set: { \"bestballpoints.y"+idx+"\": points } } )");
            eval("Members.update({_id:x._id}, { $set: { \"bestballperc.y"+idx+"\": perc } } )");
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
        }
        if (cumavail == 0){var perc = 'N';} 
            else {var perc = 100*cumpoints/cumavail;}
        Members.update({_id:x._id}, { $set: { "stats.bestballpoints": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.bestballperc": perc } } );
        })
    break;
    case 'shamblepoints':
        var years = yearsarray(); years = years.reverse();
        cursor.forEach(function(x){
            var cumpoints = 0; var cumavail = 0;
         for (var i = 0; i<years.length; i++){
            var idx = years[i];
            var points = 0; var avail = 0; var yearidx = 100*(idx-2000);
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'shamble'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + 4;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'shamble'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 4;})
            if (avail == 0){var perc = 'N';} 
                else {var perc = 100*points/avail;}
            eval("Members.update({_id:x._id}, { $set: { \"shamblepoints.y"+idx+"\": points } } )");
            eval("Members.update({_id:x._id}, { $set: { \"shambleperc.y"+idx+"\": perc } } )");
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
        }
        if (cumavail == 0){var perc = 'N';} 
            else {var perc = 100*cumpoints/cumavail;}
        Members.update({_id:x._id}, { $set: { "stats.shamblepoints": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.shambleperc": perc } } );
        })
    break;
    case 'winperc':
        cursor.forEach(function(x){
            var cumpoints = 0; var cumavail = 0;
        for (var idx = 2007; idx<2017;idx++){
            var points = 0; var avail = 0; var yearidx = 100*(idx-2000);
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:{$in:['singles','bestball']}}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + 2;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:{$in:['singles','bestball']}}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 2;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P11: x.name},{P12:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'shamble'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + 4;})
            var cursor2 = Matches.find({ $and: [ {$or:[{P21: x.name},{P22:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:'shamble'}], event:Session.get("currentevent") });
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + 4;})
            eval("Members.update({_id:x._id}, { $set: { \"points.y"+idx+"\": points } } )");
            eval("Members.update({_id:x._id}, { $set: { \"winperc.y"+idx+"\": 100*points/avail } } )");
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
        }
        Members.update({_id:x._id}, { $set: { "stats.points": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.winperc": 100*cumpoints/cumavail } } );
        })
    break;
            
    }

}

