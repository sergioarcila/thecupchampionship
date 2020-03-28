Template.linktab.helpers({
current: function(){
    return Meteor.user()
},
    getcurrentevent: function(){
        return Events.findOne({description:Session.get('currentevent')})
    },
    getbroadcastlink: function(){
        return Media.findOne({type:'broadcast',year:Session.get('selectedYear'),event:Session.get('currentevent')},{broadcastarray:-1})
    }
});

Template.linktab.events({
  'click .js-signin': function() {
    Overlay.open('overlayadmin');
  },
  'click .changeevent': function() {
    Overlay.open('overlayevent');
  },   
  'click #cupbroadcast':function() {
      var params = {day:0};
    if (Router.current().path == "/exhibitions"){var type = 'exhibition';}
      else {var type = 'cup';}
      
    switch (type){
        case 'cup':
            var yridx = 100*(Session.get('selectedYear')-2000);
              console.log('finding media on day:',params.day);
              if (params.day){
                //var m = Media.find({'data.event':Session.get('currentevent'),'data.day':params.day,'data.matchID':{$gt:yridx,$lt:yridx+100}}, {sort:{'meta.headers.last-modified':1}});
                  
                  var m = Media.find({'data.event':Session.get('currentevent'),'data.day':params.day,'data.matchID':{$gt:yridx,$lt:yridx+100}},{sort:{'data.day':1,'info.hole':1}}); 
                  //var sortstr = [];
                  //m.forEach(function(M){
                    
                  //})
                  console.log('found media on day:',params.day);
              } else {
                var m = Media.find({'data.event':Session.get('currentevent'),'data.matchID':{$gt:yridx,$lt:yridx+100}},{sort:{'data.day':1,'info.hole':1}});
              }     
        break;
        case 'exhibition':
            var e = Exhibitions.findOne({_id:Session.get('selectedExhibition')});
            var yri = (Session.get('selectedYear')-2000); var ID = e.unique+yri;
            var m = Media.find({'data.event':Session.get('currentevent'),'data.matchID':{$regex:ID}});
        break;
    }
    
    var IDs = []; var i = 0;
    m.forEach(function(mm){
        IDs[i] = mm._id; i++;
    })
     // console.log(IDs);
    
    Session.set('videoloop', {type:type, index:0, IDs:IDs});
    
  
  }
});