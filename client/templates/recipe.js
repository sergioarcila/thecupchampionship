var TAB_KEY = 'recipeShowTab';

 //import filestack from 'filestack-js';
 

//const client = filestack.init('Al7oIY4cqSzKuXf9LZpvIz');
// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.recipe.setTab = function(tab) {
  var lastTab = Session.get(TAB_KEY);
  Session.set(TAB_KEY, tab);
  
  var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
  $('.feed-scrollable').toggleClass('instant', fromRecipe);

  var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
  $('.feed-scrollable').toggleClass('delayed', toRecipe);
}

Template.recipe.onCreated(function(){
    var event = Session.get('currentevent');
   this.subscribe('matches',{event:event,name:this.data.name});
   this.subscribe('members',{event:event,name:this.data.name});
   this.subscribe('rosters',Session.get("currentevent")); 
})
Template.recipe.rendered = function (){   
    var event = Session.get('currentevent');
   var y = Members.findOne({event:event,_id:this.data._id});
    //console.log(y);
   var r = Rosters.findOne({year:Session.get('selectedYear'),members:{$in:[y.name]}});
   document.getElementById("headbanner").style.backgroundColor = r.color[0];
   //document.getElementById("headbanner").style.backgroundImage = 'url(\'img/flags/'+event+'/'+r.description+'/'+r.description+'_320x350.jpg\')';

}
Template.recipe.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  geteventformats: function(){
    var e = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')});
    var shorts = [];var i=0;
    Object.keys(e.formats).forEach(function(m){
        shorts[i] = eval('e.formats.'+m+'.short'); i++;
    })
    return shorts
},    
  activeTabClass: function() {
    return Session.get(TAB_KEY);
  },
  getplayerstat: function(obj,type,year){
    var val = eval('obj.stats.y'+year+'.'+type);
    return formatdecimal(val,0)
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeNames, this.name);
  },
  current: function(){
    return Meteor.user()
},
  getNumber: function(theNumber)
{
    if(theNumber > 0){
        return "+" + theNumber;
    }else{
        return theNumber.toString();
    }
},
 getplayerimpact: function(name){
     var year = parseInt(this.matchID/100)+2000;
    var m = Members.findOne({event:Session.get('currentevent'),name:name});
    if (this.T1[0] == name){var pwr = this.stats.powerT1[0]}
    if (this.T1[1] == name){var pwr = this.stats.powerT1[1]}
    if (this.T1[2] == name){var pwr = this.stats.powerT1[2]}
    if (this.T2[0] == name){var pwr = this.stats.powerT2[0]}
    if (this.T2[1] == name){var pwr = this.stats.powerT2[1]}
    if (this.T2[2] == name){var pwr = this.stats.powerT2[2]} 
    var dP = eval('m.stats.y'+year+'.draft.perc');
    return formatdecimal(pwr,0)+" ("+getNumber(formatdecimal((pwr-dP),1))+")";
 },    
 getcuprecord: function(){
    var y = Rosters.find({members:{$in:[this.name]}});
    var WL = [0,0];
    y.forEach(function(x){
        if (x.winner == 1){WL[0] = WL[0]+1;}
        if (x.winner == 0){WL[1] = WL[1]+1;}
    })
    return WL;
 },
getmemberprofile: function(id){
    return Members.find({_id:id});
  },
getcups: function(){
    var r = Rosters.find({members:{$in:[this.name]},event:Session.get('currentevent')});
    yrs = []; i=0;
    r.forEach(function(rr){
        yrs[i] = rr.year;
        i++;
    })
    //console.log(yrs);
    return Cups.find({event:Session.get('currentevent'),year:{$in:yrs}},{sort:{year:-1}})
},
getmatchstatus: function (matchID,event){
    var x = Matches.findOne({matchID:matchID,event:event}); var out;
        switch (x.hole){
            case 0: //if it hasn't started, print the time
                //out = x.time.getMonth() + "-" + x.time.getDate() + ", " +  x.time.getHours() + ":" + x.time.getMinutes();
                out = formatdate(x.time,'M.D.YY HH:MM');
                break;
            default:
              if (Math.abs(x.status)>(18-x.hole) & x.hole<18){out=Math.abs(x.status) + " & " + (18-x.hole);} //if its over
              else if (x.status == 0){out = "AS"}
              else {out=Math.abs(x.status) + " UP";} //if its ongoing 
       }  
    return out
  },
gettwitter: function(screenName){
    return Meteor.users.find({'services.twitter.screenName':screenName})
},
getpic: function(_id){
    //var y = Members.findOne({"_id":_id});
    //return Meteor.users.find({'services.twitter.screenName':y.twitter});
    return Media.find({'data.ID':_id,'info.type':'profile'},{limit:1})
}, 
currentteam: function(){
    //console.log(this);
    var y = Members.findOne({event:Session.get('currentevent'),_id:this._id}); 
    return Rosters.findOne({year:Session.get('selectedYear'),members:{$in:[y.name]}});
 },
getplayerteam: function(name, year){
    return Rosters.find({event:Session.get('currentevent'),year:year,members:{$in:[name]}});
},
getmatchesplayer: function(name){
    return Matches.find({ $and: [{event:Session.get('currentevent')},{matchID:{$gt:0}}, {$or: [{T1: name},{T2: name}] }]},{sort:{matchID:-1}})
}
});

Template.recipe.events({
  'click .showPicker' : function(event,template){ 
        client.pick({accept: ['image/png','.png','image/jpg','.jpg'],maxSize: 5*1024*1024,transformOptions: { maxDimensions: [100, 100] },
        }).then(function(result) {
            var info = {date:new Date(),type:"profile",parentID:null}; var data = {name:template.data,ID:template.data._id};
            var ID = Media.insert({info:info,result:result.filesUploaded[0],data:data});
        });
        
    Overlay.close();
      
},
  'click .playermatch': function(){
      var yr = parseInt(this.matchID/100)+2000
    Session.set('selectedYear',yr);
  },    
  'click .js-show-recipe': function(event) {
    event.stopPropagation();
    Template.recipe.setTab('make')
  },
  
  'click .js-show-feed': function(event) {
    event.stopPropagation();
    Template.recipe.setTab('feed')
  },
  
  'click .js-uncollapse2': function() {
    Template.recipe.setTab('recipe')
  }
});
