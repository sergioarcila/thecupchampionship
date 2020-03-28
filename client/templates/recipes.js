// counter starts at 0
  Session.setDefault("counter", 0);

  // slider starts at 20 and 80
  Session.setDefault("points", [1,1,1]);
  Session.setDefault('slider', [2017,2017]);


Template.recipes.helpers({
  getmembers: function () {
    //var cursor = Members.find({},{sort:{"stats.power":-1}});
      //cursor.forEach(function(x){console.log(x.name + " : " + x.stats.power)});
    //var sortvar = Session.get('membersort');
    //return eval('Members.find({active:1},{sort:{\''+sortvar+'\':-1}})');
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    return Session.get('data')
  },

  isheaderline: function (index){
    if (index%10>0 || index == 1){return true}
      else {return false}
  },
    eventinfo: function(){
        var e = Events.findOne({description:Session.get('currentevent')});
        //console.log(e);
    return e;
    },
    
    counter: function () {
      return Session.get("counter");
    },
    slider: function () {
      return Session.get("slider");
    },
      ischoice: function(str){
    return str == Session.get('sortstr').type;
}
    
});

Template.recipes.onCreated(function(){
  // subscribe to the publication responsible for sending the Pushups
  // documents down to the client
    //this.subscribe('matches', {event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'})
    //this.subscribe('media', Session.get('currentevent'),Session.get('selectedYear'));
    //this.subscribe('rosters',Session.get("currentevent"));
});


Template.recipes.events({
'click .statheader': function(event) {
    var sortvar = 'stats.'+ statheader.value;
    Session.set('sortvar',sortvar);
  },
'change #CBsingles': function(event) {
    var points = Session.get('points');
    Session.set('points', [$(event.target).is(':checked'), points[1], points[2]] );
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    //console.log(Session.get('points'));
  },
'change #CBbestball': function(event) {
    var points = Session.get('points');
    Session.set('points', [points[0], $(event.target).is(':checked'), points[2]] );
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    //console.log(Session.get('points'));
  },
'change #CBshamble': function(event) {
    var points = Session.get('points');
    Session.set('points', [points[0], points[1], $(event.target).is(':checked')]);
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    //console.log(Session.get('points'));
  },   
'click #newplayer': function(event,template){
    console.log(template);
    var evt = Session.get('currentevent');
    var name = document.getElementById("name").value;
    var twitter = document.getElementById("twitter").value;
    var mdata = { 
    "email" : "", 
    "phone" : "", 
    "name" : name,
    "twitter":twitter,    
    "stats" : {
        "tenure" : (0), 
        "draftperc" : 50, 
        "singlespoints" : (0), 
        "bestballpoints" : (0), 
        "shamblepoints" : 0, 
        "singlesperc" : 50, 
        "bestballperc" : 50, 
        "shambleperc" : 50, 
        "points" : 0, 
        "winperc" : 50, 
        "power" : 50, 
        "impact" : 0, 
        "y2015" : {
            "draft" : {
                "perc" : "N", 
                "pos" : "N"
            }, 
            "active" : (1), 
            "power" : 50, 
            "impact" : 0, 
            "bestball" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "singles" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "shamble" : {
                "points" : 0, 
                "perc" : 0, 
                "avail" : (0)
            }, 
            "cuprecord" : (0), 
            "winperc" : 0
        }, 
        "y2016" : {
            "draft" : {
                "perc" : "N", 
                "pos" : "N"
            }, 
            "active" : (1), 
            "power" : 50, 
            "impact" : 0, 
            "bestball" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "singles" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "shamble" : {
                "points" : 0, 
                "perc" : 0, 
                "avail" : (0)
            }, 
            "cuprecord" : (0), 
            "winperc" : 0
        }, 
        "y2017" : {
            "draft" : {
                "perc" : "N", 
                "pos" : "N"
            }, 
            "active" : (1), 
            "power" : 50, 
            "impact" : 0, 
            "bestball" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "singles" : {
                "points" : (0), 
                "perc" : (0), 
                "avail" : (0)
            }, 
            "shamble" : {
                "points" : 0, 
                "perc" : 0, 
                "avail" : (0)
            }, 
            "cuprecord" : (0), 
            "winperc" : 0
        }, 
        "bestball" : {
            "points" : (0), 
            "perc" : 50
        }, 
        "singles" : {
            "points" : 0, 
            "perc" : 50
        }, 
        "shamble" : {
            "points" : 0,
            "perc" : 50
        }, 
        "cuprecord" : [
            (0), 
            (0)
        ]
    }, 
    "event" : evt, 
};
    
Members.insert(mdata);
    alert(name,' added! Twitter: ',twitter);
    document.getElementById("name").value = "";
    document.getElementById("twitter").value = "";
}
});


Template.recipes.rendered = function () {
    var years = yearsarray();
    if (years.length<2){Session.set('slider',[years[0],years[0]])}
    else {Session.set('slider',[years[years.length-1],years[1]]);}
    Session.set('sortstr',{type:'tenure',dir:-1});
    Meteor.subscribe('members',{event:Session.get("currentevent"),name:'all'});
    Meteor.subscribe('matches',{event:Session.get("currentevent"),name:'all',year:Session.get('selectedYear')});
    Meteor.subscribe('rosters',Session.get("currentevent"));
    aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    this.$("#slider").noUiSlider({
      start: Session.get("slider"),
        tooltips: true,
      connect: true,
      direction: 'ltr', // Put '0' at the bottom of the slider    
      range: {
        'min': yearsarray()[yearsarray().length-1],
        'max': yearsarray()[0]
      },
      orientation: 'horizontal', // Orient the slider vertically
      pips: { // Show a scale with the slider
		mode: 'steps',
		stepped: true,
		density: 4
	}
    }).on('slide', function (ev, val) {
      // set real values on 'slide' event
      Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
    }).on('change', function (ev, val) {
      // round off values on 'change' event
      Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
      //console.log(Session.get('slider'));
      aggregatememberstats(Session.get('slider'),Session.get('points'), Session.get('sortstr'), 'all');
    });
    
    var elem1 = document.querySelector('.js-switch1');
    var switchery = new Switchery(elem1,{ disabled: false, disabledOpacity: 0.5, color:'red', size:'small'});
    
    var elem2 = document.querySelector('.js-switch2');
    var switchery = new Switchery(elem2,{ disabled: false, disabledOpacity: 0.75, color:'red', size:'small'});
    
    var elem3 = document.querySelector('.js-switch3');
    var switchery = new Switchery(elem3,{ disabled: false, disabledOpacity: 0.75, color:'red', size:'small'});
    
  };
