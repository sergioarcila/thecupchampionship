
Template.feed.onCreated(function(){
    this.subscribe('members',{name:'all',event:Session.get("currentevent")});
    //var CUP = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});

})


Template.feed.helpers({
  cupinfo: function () {
      var year = Session.get("selectedYear");
    return Cups.findOne({year:parseInt(year),event:Session.get('currentevent')}); 
},
  T1: function () {
    var ready = Meteor.subscribe('rosters',Session.get("currentevent")).ready();
    var year = Session.get("selectedYear");
    return Rosters.findOne({year:parseInt(year),defending:1,event:Session.get('currentevent')}); 
},
    T2: function () {
      var year = Session.get("selectedYear");
    return Rosters.findOne({year:parseInt(year),defending:0,event:Session.get('currentevent')}); 
},
  selectedmember: function(){
    return Members.findOne({_id:Session.get('selectedPlayer')})
  },
  getmembers: function() {
    var year = parseInt(Session.get('selectedYear')); var prevyear = year-1;
    switch (Session.get('sortfield')){
        case 'powerprevious':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.y'+prevyear+'.power\':-1}});');
            break;
        case 'poweroverall':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.power\':-1}});');
            break;
        case 'draftpercprevious':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.y'+prevyear+'.draft.perc\':-1}});');   
        case 'draftperc':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.draftperc\':-1}});');
            break;
        case 'impactprevious':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.y'+prevyear+'.impact\':-1}});');
            break; 
        case 'impactoverall':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.impact\':-1}});');
            break;
        case 'commish':
            return eval('Members.find({\'stats.y'+year+'.active\':1,event:Session.get(\'currentevent\')},{sort:{\'stats.y'+year+'.ranking.commish\':-1}});');
            break;
    }
  },
  getsortedvar: function(name){
    var year = parseInt(Session.get('selectedYear'));
    switch (Session.get('sortfield')){
        case 'powerprevious':
            sortstr = 'stats.y'+(year-1)+'.power';break;
        case 'poweroverall':
            sortstr = 'stats.power';break;
        case 'draftperc':
            sortstr = 'stats.draftperc';break;
        case 'draftpercprevious':
            sortstr = 'stats.y'+(year-1)+'.draft.perc';break; 
        case 'impactprevious':
            sortstr = 'stats.y'+(year-1)+'.impact';break; 
        case 'impactoverall':
            sortstr = 'stats.impact';break;
        case 'commish':
            sortstr = 'stats.y'+year+'.ranking.commish';break;    
    }
      var m = Members.findOne({name:name});
      return formatdecimal(eval('m.'+sortstr),0)
  },
  getsortedstring: function(){
    switch (Session.get('sortfield')){
        case 'powerprevious':
            return (Session.get('selectedYear')-1)+" Power"; break;
        case 'poweroverall':
            return "Power"; break;
        case 'draftpercprevious':
            return (Session.get('selectedYear')-1)+" Draft%"; break;
        case 'draftperc':
            return "Draft%"; break;    
        case 'impactprevious':
            return (Session.get('selectedYear')-1)+" Impact"; break;
        case 'impactoverall':
            return "Impact"; break;
        case 'commish':
            return "Commish"; break;   
    }
  },
  getdraftpos: function(){
    var dP = eval('this.stats.y'+Session.get('selectedYear')+'.draft.pos');
      return dP
  },
  getdraftCH: function(){
    var dPerc1 = eval('this.stats.y'+Session.get('selectedYear')+'.draft.perc');
    var dPerc2 = eval('this.stats.y'+(Session.get('selectedYear')-1)+'.draft.perc'); 
    if (dPerc2 == 0 | dPerc2 == undefined) {return 0}
    else {return parseInt(dPerc1-dPerc2)}
  },    
  getnextbest: function(num){
    var year = Session.get('selectedYear');
    var r1 = Rosters.findOne({year:parseInt(year),defending:0,event:Session.get('currentevent')});  
    var r2 = Rosters.findOne({year:parseInt(year),defending:1,event:Session.get('currentevent')});
    var r = r1.members.concat(r2.members);
      
    switch (Session.get('sortfield')){
        case 'powerprevious':
            sortstr = 'stats.y'+(year-1)+'.power';break;
        case 'poweroverall':
            sortstr = 'stats.power';break;
        case 'draftperc':
            sortstr = 'stats.draftperc';break; 
         case 'draftpercprevious':
            sortstr = 'stats.y'+(year-1)+'.draftperc';break; 
        case 'impactprevious':
            sortstr = 'stats.y'+(year-1)+'.impact';break; 
        case 'impactoverall':
            sortstr = 'stats.impact';break;
        case 'commish':
            sortstr = 'stats.y'+year+'.ranking.commish';break; 
    }
      
    return eval('Members.find({\'stats.y'+Session.get('selectedYear')+'.active\':1,name:{$nin:r},event:Session.get(\'currentevent\')},{sort:{\''+sortstr+'\':-1},limit:3});');
  },
  lastname: function(fullname) {
    var name = fullname.split(" ");
    return name[1];
  },
  selectedClass: function(){
    var m = Members.findOne({name:this.name}); 
    var output = "";
        var selectedPlayer = Session.get('selectedPlayer');        
        if (m._id == selectedPlayer){output = "selected"}
    return output
},
 teamClass: function(){
    var selectedYear = parseInt(Session.get('selectedYear'));
    var c = Cups.findOne({year:selectedYear,event:Session.get('currentevent')});
    var T1desc = c.T1; var T2desc = c.T2;
    
    if (this.banned) {
        return "banned";
    } if (Rosters.findOne({description:T1desc, year:selectedYear, members:{$in:[this.name]}})) {
        return "unavailable";
    } else if (Rosters.findOne({description:T2desc, year:selectedYear, members:{$in:[this.name]}})) {
        return "unavailable";
    } else {
        return "";
    }
},
  getcuprecord: function(name){
    var y = Rosters.find({members:{$in:[name]},event:Session.get('currentevent')});
    var WL = [0,0];
    y.forEach(function(x){
        if (x.winner == 1){WL[0] = WL[0]+1;}
        if (x.winner == 0){WL[1] = WL[1]+1;}
    })
    return WL[0]+"-"+WL[1];
 },
  getmembersT1: function() {
    var year = parseInt(Session.get('selectedYear'));
    var cursor = Rosters.findOne({year:year,defending:1,event:Session.get('currentevent')});
    var members = cursor.members;
      var sort_order = {};
      sort_order["stats.y"+year.toString()+".draft.pos"] = 1;
    return Members.find({name:{$in:members},event:Session.get('currentevent')},{sort: sort_order});
  },
  getmembersT2: function() {
    var year = parseInt(Session.get('selectedYear'));
    var cursor = Rosters.find({year:year,defending:0,event:Session.get('currentevent')}); var members;
    cursor.forEach(function(x){members = x.members;})
      var sort_order = {};
      sort_order["stats.y"+year.toString()+".draft.pos"] = 1;
    return Members.find({name:{$in:members},event:Session.get('currentevent')},{sort: sort_order});
  },
  getevent: function(){
    return Session.get('currentevent')
},
  getteamcolors: function(defending){
    var year = Session.get("selectedYear");
    var r = Rosters.findOne({year:year,defending:defending,event:Session.get("currentevent")});
    return r.color[0]
  }
  
})

Template.feed.events({
'change .currentyear': function(){
    var year = currentyear.value; // could be the P or a child element
    Session.set('selectedYear',parseInt(year));
    },
'change .sortfield': function(event){
    Session.set('sortfield',event.target.value);               
},    
'click .item-draft': function(){
    Session.set('selectedPlayer', this._id);
},
'click .playerlink': function(){
    //Meteor.subscribe('members',{name:this.name,event:Session.get("currentevent")});
},
'click .UPDN': function(event){
    var ID = Session.get('selectedPlayer');
    var year = Session.get('selectedYear');
    var m = Members.findOne({_id:ID});
    var y = Rosters.findOne({year:year,members:{$in:[m.name]},event:Session.get('currentevent')});
    var members = y.members;
    //set indices
    var dP1 = eval('m.stats.y'+year+'.draft.pos'); 
    var i1 = members.indexOf(m.name); 
    var p1 = m.name;
    var i2 = i1+parseInt(event.currentTarget.id);
    //boundaries
    if (i1 < 0 | i2 < 0 | i1>=members.length | i2>=members.length){console.log('cant do this')}
    else {
        var p2 = members[i2];
        var m2 = Members.findOne({name:p2,event:Session.get('currentevent')});
        var dP2 = eval('m2.stats.y'+year+'.draft.pos'); 
        
        //console.log(p1,i1,dP1,'swapped for',p2,i2,dP2)
        //swap and set
        //var members2 = members; members2[i1] = members[i2]; members2[i2] = members[i1]; 
        eval('Rosters.update({_id: y._id},{$set: {\"members.'+i1+'\": members[i2], \"members.'+i2+'\": members[i1]}})');

        //swap draft pos
        eval('Members.update({_id:m._id},{$set:{\'stats.y'+year+'.draft.pos\':dP2}})')
        eval('Members.update({_id:m2._id},{$set:{\'stats.y'+year+'.draft.pos\':dP1}})')

        //call team update function: updates draft percs for a list of members
        Meteor.call('updatememberstats',{name:y.members,event:Session.get('currentevent'),year:year,defending:y.defending},['draftperc2']); 

        //update draftpercs
        var info = {year:year, defending:y.defending, event:Session.get('currentevent')};
        var CUP = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    var F = []; Object.keys(CUP.formats).forEach(function(c){F.push(c+'perc')}); 
    //var types = ['winperc','tenure','power','draftperc','impact','singlesperc','bestballperc','shambleperc'];
    var types = ['winperc','tenure','power','draftperc','impact']; types.concat(F);
        
        Meteor.call('updatememberstats',{name:y.members,event:Session.get('currentevent')},['draftperc','tenure']); 
        Meteor.call('updateteamstats',info,types); 
    }
    
},   
'click .clear': function(){
    var ID = Session.get('selectedPlayer');
    var year = Session.get('selectedYear');
    var m = Members.findOne({_id:ID})
    var y = Rosters.findOne({year:year,defending:1,event:Session.get('currentevent')});
    Rosters.update({ _id: y._id },{ $pull: { members: m.name } });
    var y = Rosters.findOne({year:year,defending:0,event:Session.get('currentevent')});
    Rosters.update({ _id: y._id },{ $pull: { members: m.name } });
    eval('Members.update({ _id: m._id },{ $set: {\'stats.y'+year+'.draft.pos\':"N",\'stats.y'+year+'.draft.perc\':0}});');
    var info = {year:year, defending:0, event:Session.get('currentevent')};
    
    var CUP = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    var F = []; Object.keys(CUP.formats).forEach(function(c){F.push(c+'perc')}); 
    //var types = ['winperc','tenure','power','draftperc','impact','singlesperc','bestballperc','shambleperc'];
    var types = ['winperc','tenure','power','draftperc','impact']; types.concat(F);
    
    Meteor.call('updateteamstats',info,types);
    var info = {year:year, defending:1, event:Session.get('currentevent')};
    Meteor.call('updateteamstats',info,types);
    Meteor.call('updatememberstats',{name:m.name,event:Session.get('currentevent')},['draftperc','tenure']); 
},
'click .draftT1': function(){
    var ID = Session.get('selectedPlayer');
    var year = Session.get('selectedYear');
    var m = Members.findOne({_id:ID})
    var y = Rosters.findOne({year:year,defending:1,event:Session.get('currentevent')});
    var oy = Rosters.findOne({year:year,defending:0,event:Session.get('currentevent')});
    var members = y.members;
    var draftpos = y.members.length+oy.members.length-1;
    var numactive = eval('Members.find({event:Session.get(\'currentevent\'),\'stats.y'+year+'.active\':1}).count();');
    if (draftpos<1){draftpos=0;} //if they are the first, they are a captain
    Rosters.update({ _id: y._id },{ $push: { members: m.name } });
    var draftperc = 100*(1-(draftpos-1)/(numactive-2-1));
    eval('Members.update({ _id: m._id },{ $set: {\'stats.y'+year+'.draft.pos\':draftpos,\'stats.y'+year+'.draft.perc\':draftperc}});');
    var info = {year:year, defending:1, event:Session.get('currentevent')};
    var CUP = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    var F = []; Object.keys(CUP.formats).forEach(function(c){F.push(c+'perc')}); 
    //var types = ['winperc','tenure','power','draftperc','impact','singlesperc','bestballperc','shambleperc'];
    var types = ['winperc','tenure','power','draftperc','impact']; types.concat(F);
    Meteor.call('updatememberstats',{name:m.name,event:Session.get('currentevent')},['draftperc','tenure']); 
    Meteor.call('updateteamstats',info,types);
},
'click .draftT2': function(){
    var ID = Session.get('selectedPlayer');
    var year = Session.get('selectedYear');
    var m = Members.findOne({_id:ID})
    var y = Rosters.findOne({year:year,defending:0,event:Session.get('currentevent')});
    var oy = Rosters.findOne({year:year,defending:1,event:Session.get('currentevent')});
    var members = y.members;
    var draftpos = y.members.length+oy.members.length-1;
    var numactive = eval('Members.find({event:Session.get(\'currentevent\'),\'stats.y'+year+'.active\':1}).count();');
    if (draftpos<1){draftpos=0;} //if they are the first, they are a captain
    Rosters.update({ _id: y._id },{ $push: { members: m.name } });
    var draftperc = 100*(1-(draftpos-1)/(numactive-2-1));
    eval('Members.update({ _id: m._id },{ $set: {\'stats.y'+year+'.draft.pos\':draftpos,\'stats.y'+year+'.draft.perc\':draftperc}});');
    var info = {year:year, defending:0, event:Session.get('currentevent')};
    var CUP = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    var F = []; Object.keys(CUP.formats).forEach(function(c){F.push(c+'perc')}); 
    //var types = ['winperc','tenure','power','draftperc','impact','singlesperc','bestballperc','shambleperc'];
    var types = ['winperc','tenure','power','draftperc','impact']; types.concat(F);
    Meteor.call('updatememberstats',{name:m.name,event:Session.get('currentevent')},['draftperc','tenure']); 
    Meteor.call('updateteamstats',info,types);
}
})