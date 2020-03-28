Meteor.startup(function() {
  // Potentially prompts the user to enable location services. We do this early
  // on in order to have the most accurate location by the time the user shares
  //Geolocation.currentLocation();

    //JWPlayer.load('PjlQ31BA'); 
  //GoogleMaps.load({ v: '3', key: 'AIzaSyDi3OW8rdDJnt7GONmS3P22iS7bitZCesg', libraries: 'geometry,places' });//ios
  //GoogleMaps.load({ v: '3', key: 'AIzaSyDHpkFQDQ_WonTpnxmqakVgjViBIAi_27g', libraries: 'geometry,places' });//browser
  
  //GoogleMaps.load();  
    
    sAlert.config({
        effect: '',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });
    
    
});


