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

Template.overlayadmin.onRendered(function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

  elems.forEach(function(html) {
    var switchery = new Switchery(html,{ disabled: false, disabledOpacity: 0.5, color:'red', size:'medium'});
  });
    
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

Template.overlayadmin.helpers({
  userwants: function(type){
      var output = eval('Meteor.user().profile.notifications.'+type);
      if (output){return "checked"}
      else {return ""}
  },
  getwagers: function (){
    var yridx = parseInt(Session.get('selectedYear')-2000)*100;
    return Wagers.find({name:Meteor.user().profile.name, event:Session.get('currentevent'), matchID:{$gt:yridx,$lt:yridx+100}},{sort:{matchID:-1}});  
  },
  template: function() {
    return Overlay.template();
  },
  loggingin: function() {
        return Meteor.loggingIn()
  },  
  data: function() {
    return Overlay.data();
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
  current: function(){
    return Meteor.user()
},
    iscurrentUser: function(){
        return !(Meteor.user() == null)
    }
});

Template.overlayadmin.events({
    'click #confirm': function(event){
        Wagers.update({_id:this._id},{$set:{'info.confirmed':true}})
    },
    'change #teetime': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.teetime": $(event.target).is(':checked')}});
  },
    'change #scoring': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.scoring": $(event.target).is(':checked')}});
  },
    'change #cupover': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.cupover": $(event.target).is(':checked')}});
  },
    'change #finalmatch': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.finalmatch": $(event.target).is(':checked')}});
  },
    'change #back9': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.back9": $(event.target).is(':checked')}});
  },
    'change #upset': function(event) {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.notifications.upset": $(event.target).is(':checked')}});
  },
    'click #btn_google_login': function(event) {
    event.preventDefault();

    const errors = {
      'no-hd': 'This Google account is not a G Suite account, please try another account or contact support@clozer.ai',
      'duplicated-email': `Can't create an account because the email is already in use, please try another account or contact support@clozer.ai`,
      default: 'An error occurred while attempting to log in, please contact support@clozer.ai or try again later'
    };

    const scope = ServiceConfiguration.configurations.findOne({service: 'google'});

    console.log(scope);
    
    Meteor.loginWithGoogle(
      {requestPermissions: ['email']},
      error => {
        if (error) {
          if (error.errorType === 'Accounts.LoginCancelledError') return;
          const message = errors[error.error] || errors.default;
          alert('Login error', error);
          console.log(error);
        } else if (token && !isLogIn) {
          acceptInviteMethod.call({token});
        }
      }
    );
  },
    'submit form' ( event, template ) {
    event.preventDefault();
    
    let user = {
      email: template.find( '[name="emailAddress"]' ).value,
      password: template.find( '[name="password"]' ).value
    };
    Meteor.loginWithPassword(user.email, user.password, function (error) {
        if (!error) {
            let authenticated = true;
            let user = Meteor.user(); //custom data like user.name isn't available and I need it
            dispatch(types.CONFIG_USER_AUTH, authenticated, user, "Login Success : Debug: #login");
        } else {
            if (error.reason == 'User not found') {
                alert('User not found. Registering...');
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
                    Meteor.call('updatenewuser',{user:Meteor.user()});  
                  }
                });
            
            }
            if (error.reason == 'Incorrect password') {alert('Your password is incorrect. Try Again.')}
            
        }}
                            );

  },

    'click .login': function() {
        console.log('twitter');
     Meteor.loginWithTwitter();
    },
    'click .js-signin': function() {
    var result = Meteor.loginWithTwitter({loginStyle: 'popup', redirectUrl:'#'});     
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