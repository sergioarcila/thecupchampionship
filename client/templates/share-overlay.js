var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';
var clubs = ["DRIVER","3 WOOD","3 IRON","4 IRON ","5 IRON","6 IRON","7 IRON","8 IRON","9 IRON","PW","SW","LW","PUTTER"];

    import moment from 'moment';
 
//const client = filestack.init('Al7oIY4cqSzKuXf9LZpvIz');
        
Template.shareOverlay.onCreated(function() {
  Session.set(TWEETING_KEY, true);
  Session.set(IMAGE_KEY, null);
    
});

Template.shareOverlay.rendered = function(template){
    
    var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    
    // If we need pagination
    pagination: '.swiper-pagination',
        
        centeredSlides: false,
        paginationClickable: true,
    
    // Navigation arrows
    //nextButton: '.swiper-button-next',
    //prevButton: '.swiper-button-prev',
    
    // And if we need scrollbar
    scrollbar: '.swiper-scrollbar',
  })  
    
    
    
    Session.set('shotslider',{member:this.data.T1[0],club:"DRIVER",shot:1,hole:(this.data.hole+1),type:'cup'});
    this.$("#clubslider").noUiSlider({
      start: 0,   
      padding: 10,
      step: 1,    
      direction: 'ltr', // Put '0' at the bottom of the slider    
      range: {
        'min': 0,
        'max': 12
      },
      orientation: 'horizontal', // Orient the slider vertically
      pips: { // Show a scale with the slider
		mode: 'steps',
		stepped: true,
		density: 4
	}
    }).on('slide', function (ev, val) {
      // set real values on 'slide' event
      //var shotslider = Session.get('shotslider');
      //Session.set('shotslider', {club:Math.round(val),member:shotslider.member});
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:clubs[Math.round(val)],member:shotslider.member,shot:shotslider.shot,hole:shotslider.hole});    
    }).on('change', function (ev, val) {
      // round off values on 'change' event
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:clubs[Math.round(val)],member:shotslider.member,shot:shotslider.shot,hole:shotslider.hole,type:'cup'});
    });
    this.$("#shotslider").noUiSlider({
      start: 1,
      tooltips: true,
      padding: 10,
      step: 1,  
      direction: 'ltr', // Put '0' at the bottom of the slider    
      range: {
        'min': 1,
        'max': 8
      },
      orientation: 'horizontal', // Orient the slider vertically
      pips: { // Show a scale with the slider
		mode: 'steps',
		stepped: true,
		density: 4
	}
    }).on('slide', function (ev, val) {
      // set real values on 'slide' event
      //var shotslider = Session.get('shotslider');
      //Session.set('shotslider', {club:Math.round(val),member:shotslider.member});
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:shotslider.club,member:shotslider.member,shot:Math.round(val),hole:shotslider.hole});    
    }).on('change', function (ev, val) {
      // round off values on 'change' event
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:shotslider.club,member:shotslider.member,shot:Math.round(val),hole:shotslider.hole,type:'cup'});   
    });
    this.$("#holeslider").noUiSlider({
      start: 1,//Session.get('shotslider').hole,
      tooltips: true,
      padding: 10,
      step: 1,  
      direction: 'ltr', // Put '0' at the bottom of the slider    
      range: {
        'min': 0,
        'max': 19
      },
      orientation: 'horizontal', // Orient the slider vertically
      pips: { // Show a scale with the slider
		mode: 'steps',
		stepped: true,
		density: 4
	}
    }).on('slide', function (ev, val) {
      // set real values on 'slide' event
      //var shotslider = Session.get('shotslider');
      //Session.set('shotslider', {club:Math.round(val),member:shotslider.member});
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:shotslider.club,member:shotslider.member,hole:Math.round(val),shot:shotslider.shot});    
    }).on('change', function (ev, val) {
      // round off values on 'change' event
      var shotslider = Session.get('shotslider');
      Session.set('shotslider', {club:shotslider.club,member:shotslider.member,hole:Math.round(val),shot:shotslider.shot,type:'cup'});   
    });
};


Template.shareOverlay.helpers({
  getholestring: function(){
    var holes = ["Interview","1st Hole","2nd Hole","3rd Hole","4th Hole","5th Hole","6th Hole","7th Hole","8th Hole","9th Hole","10th Hole","11th Hole","12th Hole","13th Hole","14th Hole","15th Hole","16th Hole","17th Hole","18th Hole","POST-ROUND"];
      return holes[Session.get('shotslider').hole]
  },
    shouldhideslider: function() {
        if (Session.get('shotslider').hole > 18 || Session.get('shotslider').hole < 1){return true}
        else {return false}
    },
  attachedImage: function() {
    return Session.get(IMAGE_KEY);
  },
  getshotslider: function(){
    return Session.get('shotslider');
  },
  avatar: function() {
    return Meteor.user().services.twitter.profile_image_url_https;
  },
  
  tweeting: function() {
    return Session.get(TWEETING_KEY);
  },
  cupinfo: function(){
    var year = Session.get('selectedYear');
    return Cups.findOne({year:year})
  },
  getmatchmedia: function(matchID){
    return Media.find({'data.matchID':matchID,'data.event':Session.get('currentevent')},{sort:{'info.hole':1}});
  },
  getcardinal: function(number) {
    if (number == 1){return '1st';}
    if (number == 2){return '2nd';}
    if (number == 3){return '3rd';}
    if (number > 3) {return number+'th'}
},
files: function(){
		return S3.collection.find();
	}
});



Template.shareOverlay.events({
"click button.upload": function(event,template){
		var files = $("input.file_bag")[0].files;
        console.log(files.File);
    

        var T1 = this.T1;
        if (this.T2 == undefined){var T2 = [];}
        else {var T2 = this.T2;}
        console.log(T1,T2);
		S3.upload({
				files:files,
				path:"m"+this.matchID
			},function(e,r){
                var shotslider = Session.get('shotslider');
                console.log(shotslider);
                var isteam = 0;
                    isteam = isteammatch(template.data.matchID);
                var iM = template.data.T1.indexOf(shotslider.member);
                console.log(template.data.T1);
                if (iM >= 0) {var iteam=0; var member = template.data.T1; }
                else {        var iteam=1; var iM = template.data.T2.indexOf(shotslider.member);}
                var info = {s3info:r,date:new Date(),type:"raw",parentID:null,member:{ iteam:iteam,iM:iM,isteam:isteam},club:shotslider.club,shot:shotslider.shot,user:Meteor.user(),hole:shotslider.hole};
                var ID = Media.insert({info:info,result:r,data:{event:template.data.event,matchID:template.data.matchID,day:template.data.day,type:template.data.type,course:template.data.course,T1:T1,T2:T2}});
     
                
                
                //Meteor.call('updateMediaMetadata',ID);     //jts, doesn't work as of 2018aug
		});
	},
'change .memberlist' : function(event,template){
    var shotslider = Session.get('shotslider');
    Session.set('shotslider',{club:shotslider.club,member:event.target.value,shot:shotslider.shot,hole:shotslider.hole,type:'cup'});
},
'click .swiper-slide': function(){
    Session.set('videoloop',{type:'match',IDs:[],index:0});
    console.log(this);
    if (this.data.type == 'stroke'){
        Overlay.open('fileOverlay2',this);}
    else {Overlay.open('fileOverlay',this);}
},    
'click .showPicker' : function(event,template){ 
        client.pick({accept: ['image/*','video/*'],maxSize: 40*1024*1024, fromSources: ['local_file_system']
        }).then(function(result) {
            console.log(result);
            var shotslider = Session.get('shotslider');
            var info = {date:new Date(),type:"raw",parentID:null,member:shotslider.member,club:shotslider.club,shot:shotslider.shot,user:Meteor.user()};
            var ID = Media.insert({info:info,result:result.filesUploaded[0],data:template.data});

            if (result.mimetype !== "video/quicktime"){
                var parentURL = result.filesUploaded[0].url;
                var transformedUrl = client.transform(result.filesUploaded[0].url, {
                  resize: {width: 48, height:48, fit:'crop'}
                });
                console.log(JSON.stringify(transformedUrl))
                console.log("storing...")
                client.storeURL(transformedUrl).then(function(result){
                    info = {date:new Date(),type:"thumb", parentURL:parentURL};
                    Media.insert({info:info,result:result,data:template.data});
                })
            }
            var log = function(result) {
                console.log(JSON.stringify(result))
            }

            console.log(result.filesUploaded[0].handle);
            var log = client.retrieve(result.filesUploaded[0].handle, { metadata: true });
            console.log(log);
        });
    
    
        
    
},
    
'click .filepicker': function(){
    
     var _this = $(this); 
  filepicker.pick(
    {
      mimetype: 'image/*',
      hide: true,
      maxSize: 2*1024*1024,
      imageQuality: 90,
      imageDim: [800, null],
      services: ['COMPUTER', 'WEBCAM'],
      openTo: 'COMPUTER'
    },
    function(Blob) {
      setTimeout(previewImage(Blob.url), 2000);
      console.log(JSON.stringify(Blob));
      _this.data("doc-url", Blob.url);
    },
    function(FPError) {
      console.log(FPError.toString());
    },
    function(FPProgress) {
      console.log(parseInt(FPProgress.progress));
      progressPercentage = parseInt(FPProgress.progress) + '%';
      $('.progress-bar').css('width', progressPercentage).text(progressPercentage);
    }
  );
}

    
    
    
});
