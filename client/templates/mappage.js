Template.mappage.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('map', function(map) {
     console.log("I'm ready!");
  });
    

});

Template.mappage.events({
 'change .currentmapmatch': function(){
    var matchID = parseInt(currentmapmatch.value); // could be the P or a child element
    Session.set('mapmatch',matchID);

    GoogleMaps.ready('map', function(map) {
    // Add a marker to the map once it's ready
        var m = Matches.findOne({event:Session.get("currentevent"), matchID:Session.get("mapmatch")}); 
        console.log(m);
        var coordinates = []; var location = []; var long; var i = 0; var sk = []; var matchup =[]; var matchID =[]; var holes = []; var hole;
        for (var h=1;h<=18;h++){
            hole = eval('m.holes.h'+h);
            if (hole.result !== 2){
            location[i] = hole.location;
            matchID[i] = m.matchID; holes[i] = h; i++;
            }
        }
          console.log(location);
          var infowindow = new google.maps.InfoWindow();
          
          for (i=0;i<location.length;i++){
            var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].coordinates[0], location[i].coordinates[1]),
            map: map.instance
            });
              
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent("MatchID: " + matchID[i] + "Hole: " + holes[i] +
                                          "<br>GPS:" + location[i].coordinates +
                                          "<br>Speed:" + location[i].speed +
                                          "<br>Accuracy:" + location[i].accuracy);
                    infowindow.open(map, marker);
                }
            })(marker, i));    
        }  
          
        

  });
      
  }
    
    
})

Template.mappage.helpers({
  isAdmin: function() {
    return Meteor.user() && Meteor.user().admin;
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
    iscurrentmapmatch: function (matchID){
      var out = "";
    if (matchID == Session.get("mapmatch")){out = "selected";}
      return out
  },
  isselected: function (name, matchID, pidx){
    var y = Matches.findOne({matchID:matchID}); 
    if (eval('y.P'+pidx+' == name')) {return 1}
  },
  getmatches: function(){
      var matchID = 100*(Session.get("selectedYear")-2000);
      return Matches.find({event:Session.get("currentevent"),matchID:{$gt:matchID,$lt:matchID+100}},{sort:{matchID:1}})
  },
  getmatch: function(){
      return Matches.findOne({_id:Session.get('selectedMatch')})
  },
  getmembers: function(){
    return Members.find({},{sort:{name:1}});
  },
    geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
    },
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      
      return {
        center: new google.maps.LatLng(42.3369244,-71.0419616),
        //center: new google.maps.LatLng(38.111957, -84.611194),
        zoom: 16,
        mapTypeId: 'satellite'
      };
    }
  }
});


