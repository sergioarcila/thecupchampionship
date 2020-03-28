var TEMPLATE_KEY = 'overlayTemplate';
var DATA_KEY = 'overlayData';
var ANIMATION_DURATION = 200;

Session.setDefault(TEMPLATE_KEY, null);

Overlay = {
  open: function(template, data) {
    Session.set(TEMPLATE_KEY, template);
    Session.set(DATA_KEY, data);
  },
  close: function() {
    Session.set(TEMPLATE_KEY, null);
    Session.set(DATA_KEY, null);
  },
  isOpen: function() {
    return ! Session.equals(TEMPLATE_KEY, null);
  },
  template: function () {
    return Session.get(TEMPLATE_KEY);
  },
  data: function () {
    return Session.get(DATA_KEY);
  }
}

//Template.overlayevent.rendered = function(){
//    var elem1 = document.querySelector('.event-switch1');
//    var switchery = new Switchery(elem1,{ disabled: false, disabledOpacity: 0.5, color:'red', size:'small'});
    
 //   var elem2 = document.querySelector('.event-switch2');
//    var switchery = new Switchery(elem2,{ disabled: true, disabledOpacity: 0.75, color:'red', size:'small'});
    

//}



Template.overlayevent.onRendered(function() {    
    
  this.find('#overlay-hook')._uihooks = {
    insertElement: function(node, next, done) {
      var $node = $(node);

      $node
      .hide()
      .insertBefore(next)
      .velocity('fadeIn', {
        duration: ANIMATION_DURATION
      });
    },
    removeElement: function(node, done) {
      var $node = $(node);

      $node
      .velocity("fadeOut", {
        duration: ANIMATION_DURATION,
        complete: function() {
          $node.remove();
        }
      });
    }
  }
});

Template.overlayevent.helpers({
  template: function() {
    return Overlay.template();
  },
  eventselected: function(description) {
    return description == Session.get('currentevent')
  },
  getcurrentevent: function() {
    return Events.findOne({description:Session.get("currentevent")})
  },
  getevents: function(){
    return Events.find({},{sort:{order:1}});
  },
  data: function() {
    return Overlay.data();
  },
  latestNews: function() {
    return News.latest();
  },
  getcups: function (){
    return Cups.find({},{sort:{year:-1}});  
  },
  iscurrentyear: function (year){
      var out = "";
    if (year == Session.get("selectedYear")){out = "selected";}
      return out
  },
  isselected: function (name, matchID, pidx){
    var y = Matches.findOne({matchID:matchID}); 
    if (eval('y.P'+pidx+' == name')) {return 1}
  },
  getmatches: function(){
      var matchID = 100*(Session.get("selectedYear")-2000);
      return Matches.find({matchID:{$gt:matchID,$lt:matchID+100}},{sort:{matchID:1}})
  },
  getmatch: function(){
      return Matches.findOne({_id:Session.get('selectedMatch')})
  },
  getmembers: function(){
    return Members.find({},{sort:{name:1}});
  },
  ready: function() {
    return Router.current().feedSubscription.ready();
  },
  current: function(){
    return Meteor.user()
},
    iscurrentUser: function(){
        return !(Meteor.user() == null)
    },
    iscurrentyear: function (year){
      var out = "";
    if (year == Session.get("selectedYear")){out = "selected";}
      return out
  },
    getcups: function (){
    return Cups.find({event:Session.get("currentevent")},{sort:{year:-1}});  
  }
    
    
});

Template.overlayevent.events({
    'change .currentyear': function(){
    var year = currentyear.value; // could be the P or a child element
    Session.set('selectedYear',year);
    },
    
    'submit form' ( event, template ) {
        
        
    event.preventDefault();
    
    let user = {
      email: template.find( '[name="emailAddress"]' ).value,
      password: template.find( '[name="password"]' ).value
    };
    Meteor.loginWithPassword(user.email, user.password);

    Accounts.createUser( user, ( error ) => {
      if ( error ) {
        alert( error.reason, 'danger' );
      } else {
          
        Meteor.call( 'sendVerificationLink', ( error, response ) => {
          if ( error ) {
            alert( error.reason, 'danger' );
          } else {
            alert( 'Welcome!', 'success' );
          }
        });
      }
    });
  },
    'click .eventclick' : function(event){
        Session.set('currentevent',event.target.id);
        var ready = Meteor.subscribe('matches', {event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'})
        Meteor.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
        Meteor.subscribe('rosters',Session.get("currentevent"));
        return ready
    },
    'click .login': function() {
        console.log('twitter');
     Meteor.loginWithTwitter();
    },
       'click .js-signin': function() {
    Meteor.loginWithTwitter({loginStyle: 'redirect'});
  },
    'click .logout': function() {
     Meteor.logout();
    },
    'change .currentmatch': function(){
    var matchID = parseInt(currentmatch.value); // could be the P or a child element
    var y = Matches.findOne({matchID:matchID});
    Session.set('selectedMatch',y._id);
    console.log(Session.get('selectedMatch'));
    }, 
    'change .currentyear': function(){
    var year = currentyear.currentyear.value; // could be the P or a child element
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
        console.log('clicked');
    updatememberstats('Zach Gubser','power');    
    },
    'click .updatematchpower': function(){
        updatematch(914,'powers');  
        //var y = Meteor.call('aggroster');
        //console.log(y);
    },
    'click .updateteamstats': function(){
        var defending = 0; var year = 2007;
        updateteamstats('winperc',year,defending);
        updateteamstats('singlesperc',year,defending);
        updateteamstats('bestballperc',year,defending);
        updateteamstats('shambleperc',year,defending);
        updateteamstats('tenure',year,defending);
        updateteamstats('power',year,defending);
        updateteamstats('draftperc',year,defending);
        updateteamstats('impact',year,defending);
        
        var defending = 1; 
        updateteamstats('winperc',year,defending);
        updateteamstats('singlesperc',year,defending);
        updateteamstats('bestballperc',year,defending);
        updateteamstats('shambleperc',year,defending);
        updateteamstats('tenure',year,defending);
        updateteamstats('power',year,defending);
        updateteamstats('draftperc',year,defending);
        updateteamstats('impact',year,defending);
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
    'click .js-close-overlay': function(event) {
    event.preventDefault();
    Overlay.close()
  },
    'click .js-close-admin': function(event) {
    event.preventDefault();
    Router.go('/admin');
    Overlay.close()
  }
    
    
})