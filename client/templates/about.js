Template.about.onCreated(function(){
  // subscribe to the publication responsible for sending the Pushups
  // documents down to the client
    let template = Template.instance(); 
    template.subscribe('members', {event:Session.get('currentevent'),name:'all'});
    template.subscribe('rosters', Session.get('currentevent'));
});

Template.about.helpers({
  isAdmin: function() {
    return Meteor.user() && Meteor.user().admin;
  },
  
  latestNews: function() {
    return News.latest();
  },
  getmembers: function() {
    var year = Session.get('selectedYear');
    var u = Members.findOne({name:Meteor.user().profile.name,event:Session.get('currentevent')});
      var r = Rosters.findOne({year:year,members:Meteor.user().profile.name});
    if (u.stats.y2017.ranking.confirmed !== undefined){
        var confirmed = eval('u.stats.y'+year+'.ranking.confirmed');
    }
    if (u.stats.y2017.ranking.picks !== undefined){
        var picks = eval('u.stats.y'+year+'.ranking.picks');
    }  
      
    if (confirmed){
        return eval('Members.find({\'stats.y'+year+'.active\':1,_id:{$in:picks}},{sort:{\'stats.y'+year+'.ranking.commish\':-1}});')
                    }  
      else {
    return eval('Members.find({name:{$in:r.members}},{sort:{\'stats.y'+year+'.ranking.commish\':-1}});')
                }
  },
  getentries: function(){
    return Members.find({'stats.y2017.ranking.confirmed':true});
  },
  getstats: function(type){
    var m = Members.findOne({_id:this._id});
    var stats = []; var names = []; var i = 0; var stat = 0;
    m.stats.y2017.ranking.picks.forEach(function(x){
        var m2 = Members.findOne({_id:x,event:Session.get('currentevent')});
        if (type == 'impact'){stat = stat + eval('m2.stats.y2017.'+type);}
        if (type == 'points'){stat = stat + m2.stats.y2017.bestball.points + m2.stats.y2017.shamble.points + m2.stats.y2017.singles.points}
        stats[i] = stat;
        names[i] = m2.name; i++;
    })  
    return {stats:stats, names:names}
  },    
  getrankings: function(){
    var x = Members.findOne({name:"Tony Bickel"});
    var rankings = []; var i =0;
    for(var key in x) {
       if (key.indexOf("power") > -1 & key !== "powers" & key !== "powerCommissioner") 
       {rankings[i] = key.substr(5,key.length); i++;}
     }
    return Members.find({_id:{$in:rankings}});
  },
 UserRankExists: function(){
    var x = Members.findOne({name:"Tony Bickel"});
    var rankings = []; var i = 0;
    for(var key in x) {
       if (key.indexOf("power") > -1 & key !== "powers" & key !== "powerCommissioner") 
       {rankings[i] = key.substr(5,key.length); i++;}
     } 
     //console.log(Meteor.user().services.twitter.screenName);
    var y = Members.findOne({twitter:Meteor.user().services.twitter.screenName});
     //console.log(rankings);
    if (rankings.indexOf(y._id) > -1){return true}
    else {return false}
 },
    current: function(){
    return Meteor.user()
},
    iscurrentUser: function(){
        return !(Meteor.user() == 'undefined')
    },
    hasControl: function(){
        var twitter = Meteor.user().services.twitter.screenName; var out = 0;
        //console.log(twitter);
        var y = Members.find({twitter:twitter});
        y.forEach(function(y){
            //console.log(y.name); console.log(Session.get('selectedRanking'));
            if (y._id == Session.get('selectedRanking')){out = 1;}
        })
        
        if (twitter == 'TheCupKY'){out = 1;}
        return out
    },
    picksopen: function(){
        //var playerlimit=3;
        //var u = Members.findOne({name:Meteor.user().profile.name,event:Session.get('currentevent')});       
        //if (u.stats.y2017.ranking.picks !== undefined){return u.stats.y2017.ranking.picks.length !== playerlimit}
        //else {return false}
        var u = Members.findOne({name:Meteor.user().profile.name,event:Session.get('currentevent')});    
        if (u.stats.y2017.ranking.confirmed !==undefined){return u.stats.y2017.ranking.confirmed}
        else {return false}
    },
    selectedClass: function(){
    var m = Members.findOne({name:this.name,event:Session.get('currentevent')}); 
    var output = "";
    var u = Members.findOne({name:Meteor.user().profile.name,event:Session.get('currentevent')});           
        if (u !== undefined){
            if (u.stats.y2017.ranking.picks.includes(m._id)){output = "picked";}
        }
    return output
},
    submittedClass: function(){
    var u = Members.findOne({name:Meteor.user().profile.name,event:Session.get('currentevent')});   
    var output = "";           
        if (u.stats.y2017.ranking.confirmed !== undefined){
            if (u.stats.y2017.ranking.confirmed){output = 'submitted';}
        }
    return output
}
});

Template.about.events({
  'submit form': function(event) {
    event.preventDefault();

    var text = $(event.target).find('[name=text]').val();
    News.insert({ text: text, date: new Date });

    alert('Saved latest news');
  },
  'click .player':function(event){
    var playerlimit=3;
    var u = Members.findOne({event:Session.get('currentevent'),name:Meteor.user().profile.name});  
      
      if (u.stats.y2017.ranking.picks !== undefined){
          if (u.stats.y2017.ranking.picks.includes(event.currentTarget.id)){  
              var res = Members.update({_id:u._id},{$pull:{'stats.y2017.ranking.picks':event.currentTarget.id}});
              } else {
                  if (u.stats.y2017.ranking.picks.length<playerlimit){
                  var res = Members.update({_id:u._id},{$addToSet:{'stats.y2017.ranking.picks':event.currentTarget.id}});
                  }
                  else {alert('You can only pick three players.')}
              }   
      }
      else {
          var res = Members.update({_id:u._id},{$addToSet:{'stats.y2017.ranking.picks':event.currentTarget.id}});
      }
      
  },
  'click .picksubmit': function(){
    var u = Members.findOne({event:Session.get('currentevent'),name:Meteor.user().profile.name});
      if (u.stats.y2017.ranking.confirmed == undefined){
          Members.update({_id:u._id},{$set:{'stats.y2017.ranking.confirmed':true}})}
      else {
      Members.update({_id:u._id},{$set:{'stats.y2017.ranking.confirmed':!u.stats.y2017.ranking.confirmed}})
      }
  },
  'change select': function(event,template){
    var ranking = currentranking.value; // could be the P or a child element
    Session.set('selectedRanking',ranking);
    
},
  'change .cupcheck':function(event){
    var limit = 3;
    var c=document.getElementsByClassName("cupcheck"); var checks = 0;
      
    for (var i=0;i<c.length;i++){
        if (c[i].checked){console.log('Checked: '+c[i].id);checks++;}
    }  
    if (checks > 3){event.currentTarget.checked = false; alert('You can only pick 3.');}
    
  },

  'click .login': function() {
    Meteor.loginWithTwitter();
  }
})