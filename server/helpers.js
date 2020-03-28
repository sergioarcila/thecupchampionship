var debug = 0;
//import convnetjs from 'convnetjs';

var exif = require('exiftool');
    var fs   = require('fs');
var request = require('request');
//var request = require('sync-request');

Meteor.startup(function() {
        yearsarray = function(event){
            var c = Cups.find({event:event},{sort:{year:-1}})
            var years = [];var i= 0;
            c.forEach(function(x){years[i] = x.year;i++;})
            return years
        },
        getbinstatus = function(status){
            if (status>0){return 1}
            if (status==0){return 0}
            if (status<0){return -1}
        },    
        average = function(elmt){
            var sum = 0;
            for( var i = 0; i < elmt.length; i++ ){
            sum += parseInt( elmt[i], 10 ); //don't forget to add the base
            }
            return sum/elmt.length;
        },
        sumarray = function(elmt){
            var sum = 0;
            for( var i = 0; i < elmt.length; i++ ){
            sum += parseInt( elmt[i], 10 ); //don't forget to add the base
            }
            return sum
        }, 
        add2array = function(arr,num){
            var arr2 =[];
            for( var i = 0; i < arr.length; i++ ){
                arr2[i] = arr[i]+num;
            }
            return arr2
        },
        indexOfMax = function (arr) {
            if (arr.length === 0) {
                return -1;
            }

            var max = arr[0];
            var maxIndex = 0;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > max) {
                    maxIndex = i;
                    max = arr[i];
                }
            }

            return maxIndex;
        }
           
      });



Meteor.methods({
getEXIF(path){
        
request.get(path, {encoding: null},function (error, response, body) {
  //console.log('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
    
    exif.metadata(body, function (err, metadata) {
          if (err)
            throw err;
          else
            console.log(metadata);
            
        });
    
});
   // HTTP.get(path, {npmRequestOptions: {encoding: null}}, function(err,data) {
   // //fs.readFile(path, function (err, data) {
   //   if (err)
   //     throw err;
  //    else {
  //        console.log(data);
  //      exif.metadata(data, function (err, metadata) {
  //        if (err)
  //          throw err;
  //        else
  //          console.log(metadata);
  //          console.log('gps is ' + metadata.gpsCoordinates);
  //      });
  //    }
  //  });
    
},
    
 updateMediaMetadata(ID){
     
//declare a simple async function
     var m = Media.findOne({_id:ID});
     
     //var res = request.get(m.info.s3info.url, {encoding: null});
     //var res = HTTP.call( 'HEAD', m.info.s3info.url );     
     HTTP.call( 'HEAD', m.info.s3info.url, (error, response) => { 
        if (error){
            response.headers.lastmodified = new Date();
            response.headers.headercomment = 'could not parse';}
        else {
            response.headers.lastmodified = response.headers["last-modified"]; 
             console.log(response);
             Media.update({_id:ID},{$set:{meta:response}});  }
     } );
     //res.headers.lastmodified = res.headers["last-modified"]; 
     //console.log(res);
     //update({_id:ID},{$set:{meta:res}});
     //console.log(ID);
},    
 getMediaMetadata2(body){
    exif.metadata(body, function (err, metadata,ID) {
                              if (err)
                                throw err;
                              else
                                //console.log('match: ' + M._id);
                                console.log(metadata);
                                //Media.update({_id:ID},{$set:{exif:metadata}});  
                                Media.update({_id:ID},{$set:{EXIF:metadata}})
                            });
 },    
 updateMediaMetadata2(ID){
                    var m = Media.findOne({_id:ID});
                    request.get(m.info.s3info.url, {encoding: null}, function (error, response, body) {
                      //console.log('error:', error); // Print the error if one occurred
                      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                      //console.log('body:', body); // Print the HTML for the Google homepage.
                            //Media.update({_id:ID},{$set:{exif:metadata}}); 
                        exif.metadata(body, function (err, metadata) {
                              if (err)
                                throw err;
                              else
                                //console.log('match: ' + m._id);
                                console.log(metadata);
                                Media.update({_id:ID},{$set:{exif:metadata}});  
                                //  return metadata
                            });

                    });

         
 },    
trainMatchPredictor(params){
    var net; 
	var layer_defs = [];
    // Get training data and labels
    var m = Matches.find({event:params.event,matchID:{$gt:1200,$lt:1600}});
    var train = {data:[],labels:[]}; 
    var hrem; var status; var yr;
    m.forEach(function(mm){
        var T1DP = []; var T2DP = [];
        yr = 2000+parseInt(mm.matchID/100);
        mm.T1.forEach(function(M){
                var p = Members.findOne({event:params.event,name:M});
                T1DP.push(eval('p.stats.y'+yr+'.draft.perc'))
            })
        mm.T2.forEach(function(M){
                var p = Members.findOne({event:params.event,name:M});
                T2DP.push(eval('p.stats.y'+yr+'.draft.perc'))
        })
        dDP = average(T1DP)-average(T2DP);
        for (var i=1;i<18;i++){
            var reshot = [0,0,0];
            status = eval('mm.holes.h'+i+'.status.all');
            if (eval('mm.holes.h'+i+'.result') == 2){break;}
            else {
            var hot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,status,dDP];    
            hot[i-1] = 1;
            train.data.push(hot);
                //reshot[getbinstatus(mm.status)+1] = 1;
            train.labels.push((getbinstatus(mm.status)+1));
            }
        }
        
    })
    // Get testing data and labels
    var m = Matches.find({event:params.event,matchID:{$gt:1600,$lt:1700}});
    var test = {data:[],labels:[]}; 
    var hrem; var status; var yr;
    m.forEach(function(mm){
        var T1DP = []; var T2DP = [];
        yr = 2000+parseInt(mm.matchID/100);
        mm.T1.forEach(function(M){
                var p = Members.findOne({event:params.event,name:M});
                T1DP.push(eval('p.stats.y'+yr+'.draft.perc'))
            })
        mm.T2.forEach(function(M){
                var p = Members.findOne({event:params.event,name:M});
                T2DP.push(eval('p.stats.y'+yr+'.draft.perc'))
        })
        dDP = average(T1DP)-average(T2DP);
        for (var i=1;i<18;i++){
            var hot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            //var reshot = [0,0,0];
            status = eval('mm.holes.h'+i+'.status.all');
            if (eval('mm.holes.h'+i+'.result') == 2){break;}
            else {
            var hot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,status,dDP];        
            hot[i-1] = 1;
            test.data.push(hot);
                //reshot[getbinstatus(mm.status)+1] = 1;
            test.labels.push((getbinstatus(mm.status)+1));
            }
        }
    })
    
    
	// input layer declares size of input. here: 2-D data
	// ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
	// then the first two dimensions (sx, sy) will always be kept at size 1
	layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:20});
	// declare 20 neurons, followed by ReLU (rectified linear unit non-linearity)
	layer_defs.push({type:'fc', num_neurons:10, activation:'relu'}); 
	// declare the linear classifier on top of the previous hidden layer
	layer_defs.push({type:'softmax', num_classes:3});

	net = new convnetjs.Net();
	net.makeLayers(layer_defs);

	var trainer = new convnetjs.SGDTrainer(net, {method: 'adadelta', l1_decay: 0.01,
                                    batch_size: 1});
	for (var j=0;j<train.data.length;j++){ 
		// forward a random data point through the network
		var x = new convnetjs.Vol(train.data[i]);
		var prob = net.forward(x); 
        var P = [prob.w[0],prob.w[1],prob.w[2]];
		// prob is a Vol. Vols have a field .w that stores the raw data, and .dw that stores gradients
		var label = (train.labels[i]);
        if (debug) {
            console.log('data:'+train.data[i]); // prints 0.50101
            console.log('label:' + label)
            console.log(P); // prints 0.50101
        }
		trainer.train(x, label); // train the network, specifying that x is class zero
	}
		console.log('TRAINING DONE');
		var numright=0; var total=0;
	for (var i=0;i<test.data.length;i++){ 
			// forward a random data point through the network
			var x = new convnetjs.Vol(test.data[i]);
			var prob = net.forward(x); 
            var P = [prob.w[0],prob.w[1],prob.w[2]];
			
            if (debug){
                console.log('probabilities' + P); // prints 0.50101
                console.log('data' + test.data[i]); // prints 0.50101
                console.log('result' + test.labels[i]); // prints 0.50101
                console.log('guess' + indexOfMax(P));
            }
			if (indexOfMax(P) == (test.labels[i])){console.log('RIGHT'); numright++;}
			else {console.log('WRONG');}
			total++;
	}
	console.log('Accuracy is: ', 100*numright/total, 'Tested on: ', total);
    // network outputs all of its parameters into json object
    var json = net.toJSON();
    // the entire object is now simply string. You can save this somewhere
    var str = JSON.stringify(json);
    var e = Events.findOne({description:params.event});
    Events.update({_id:e._id},{$set:{'model.match.net':str,'model.match.accuracy':100*numright/total,'model.match.type':'CNN'}})
    
    // later, to recreate the network:
    //var json = JSON.parse(str); // creates json object out of a string
    //var net2 = new convnetjs.Net(); // create an empty network
    //net2.fromJSON(json); // load all parameters from JSON
    
},    
updatenewuser(params){
    // Set user properties
                var data = {
                    "notifications" : {
                        "teetime" : true, 
                        "scoring" : true, 
                        "cupover" : true, 
                        "finalmatch" : true, 
                        "back9" : false, 
                        "upset" : false
                    }
                };
                
                if (params.user.emails !== undefined){var m = Members.findOne({email:params.user.emails[0].address.toLowerCase()});}
                if (params.user.services.twitter !== undefined){var m = Members.findOne({twitter:params.user.services.twitter.screenName});}
                
                if (m !== undefined){data.event = m.event; data.name=m.name;}
                else {Overlay.close(); Overlay.open('overlayevent');}
                
                Meteor.users.update(params.user._id,{$set:{profile : data}})
                
},
updatematch(info,type){
        var yr = 2000+parseInt(info.matchID/100);
        if (info.matchID == 'all'){var cursor2 = Matches.find({matchID:{$gt:0},event:info.event,hole:{$gt:0}},{sort:{matchID:1}});}
        else {var cursor2 = Matches.find({matchID:info.matchID,event:info.event});}
        cursor2.forEach(function(y){
            type.forEach(function(t){
            
            if (debug){
                        //console.log('MatchType:'+y.type+' | matchID' + y.matchID);
                       //console.log('T1'+y.T1); console.log('T2'+y.T2);
                      }
    switch (t){       
    case 'points': //jtsfixed
        var year = parseInt(y.matchID/100)+2000
        var e = Cups.findOne({event:info.event,year:year});
        var ptsavail = eval('e.formats.'+y.type+'.points');
            
        // update match points for 18 hole match, if pts change, ask for cup points update
        var T1pts = 0; var T2pts = 0; var T1ptsO = y.T1pts; var T2ptsO = y.T2pts; 
        if (Math.abs(y.status)>(18-y.hole) | y.hole == 18){
            if (y.status>0){ T1pts = T1pts + ptsavail[2];T2pts = T2pts + 0;}
            if (y.status<0){ T1pts = T1pts + 0;          T2pts = T2pts + ptsavail[2];}
            if (y.status==0){T1pts = T1pts + ptsavail[2]/2;T2pts = T2pts + ptsavail[2]/2;}
        }
        if (Math.abs(y.statusF9)>(9-y.hole) | y.hole == 9){
            if (y.statusF9>0){T1pts = T1pts + ptsavail[0];T2pts = T2pts + 0;}
            if (y.statusF9<0){T1pts = T1pts + 0;T2pts = T2pts + ptsavail[0];}
            if (y.statusF9==0){T1pts = T1pts + ptsavail[0]/2;T2pts = T2pts + ptsavail[0]/2;}
        }
        if (Math.abs(y.statusB9)>(18-y.hole) | y.hole == 18){
            if (y.statusB9>0){T1pts = T1pts + ptsavail[1];T2pts = T2pts + 0;}
            if (y.statusB9<0){T1pts = T1pts + 0;T2pts = T2pts + ptsavail[1];}
            if (y.statusB9==0){T1pts = T1pts + ptsavail[1]/2;T2pts = T2pts + ptsavail[1]/2;}
            //console.log('enteredb9' + y.statusB9);
        }
        if (sumarray(ptsavail)==(T1pts+T2pts) || y.hole==0){var active = 0;} else {var active = 1;}
            if (debug) {console.log('UpdateMatch, Points: active'+active + 'ptsavail'+sumarray(ptsavail)+'totalpts'+(T1pts+T2pts));}
        Matches.update({_id:y._id},{$set:{T1pts:T1pts,T2pts:T2pts,active:active}})
        if (Math.abs(T1pts-T1ptsO)>0 | Math.abs(T2pts-T2ptsO)>0){
            Meteor.call('updatecup',{event:info.event,matchID:y.matchID},['points']); 
            
            //Meteor.call('updatematch',{event:info.event,matchID:y.matchID},'holes');
        }
        break;
    case 'holes':
        var x = Courses.findOne({description:y.course});
        var pars = x.par; var p3 = [0,0,0]; var p4 = [0,0,0]; var p5 = [0,0,0]; var result = y.result;
            //console.log(y);
        for (var h = 1; h<=18; h++){
            result = eval('y.holes.h'+h+'.result');
            if (result== 2){break;}
            if (result== 1){eval('p'+pars[h-1]+'[0]=p'+pars[h-1]+'[0]+1');}
            if (result==-1){eval('p'+pars[h-1]+'[1]=p'+pars[h-1]+'[1]+1');}
            if (result== 0){eval('p'+pars[h-1]+'[2]=p'+pars[h-1]+'[2]+1');}
        }
        Matches.update({_id:y._id},{$set:{'record.par3':p3,'record.par4':p4,'record.par5':p5}})    
        break; 
    case 'predict': //current match prediction, jts skipped
            var m = Matches.findOne({matchID:matchID,event:info.event}); 
            //console.log(matchID);
            var p = Members.findOne({name:m.P11,event:info.event});
            var pwrT1 = p.stats.power;
                p = Members.findOne({name:m.P21,event:info.event});
            var pwrT2 = p.stats.power;
            
            if (m.type !== "singles"){
            var p = Members.findOne({name:m.P12,event:info.event});
                pwrT1 = pwrT1 + p.stats.power; pwrT1 = pwrT1/2;
                p = Members.findOne({name:m.P22,event:info.event});
                pwrT2 = pwrT2 + p.stats.power; pwrT2 = pwrT2/2;
            }
            
            var dP = pwrT1 - pwrT2; var dH = dP/50; 
            for (var i=0;i<18;i++){
                if (Math.abs(dH*(i+1)) > (17-i)){
                    var predict = [dH*(i+1), (17-i)];
                    break;
                }
            }
            
            //console.log('HoleDiff: ' + dH + 'Predict: ' + dH*18);
            Matches.update({_id:m._id},{$set:{'stats.dH':dH*18,'stats.predict':predict}}); 
            break; 
    case 'predict2': //for cup significance metric, jtsfixed
            var m = Matches.findOne({matchID:matchID,event:info.event}); 
            var c = Cups.findOne({year:2000+parseInt(matchID/100),event:info.event})
            
            //Get current cup status, and match points: c.T1pts, c.T2pts
            var predictedstatus = [c.T1pts, c.T2pts];
            var matchpts = eval('c.matchvalues.'+m.type) - (m.T1pts + m.T2pts); 
            
            //if the match is still going
            if (matchpts){
            //if T1 wins next hole
            //if they would be ahead enough to take all the points
            if ((m.status+1) > (18-(m.hole+1))){predictedstatus[0] = predictedstatus[0] + matchpts;}
            //if they would be dormie
            else if ((m.status+1) == (18-(m.hole+1))){predictedstatus[0] = predictedstatus[0] + matchpts/2;}
            
            //if T1 wins next hole
            //if they would be ahead enough to take all the points
            if ((m.status-1) < ((m.hole+1)-18)){predictedstatus[1] = predictedstatus[1] + matchpts;}
            //if they would be dormie
            else if ((m.status-1) == ((m.hole+1)-18)){predictedstatus[1] = predictedstatus[1] + matchpts/2;}
            }
            
            //print max vector to match object in h*.event.predict, and predict
            eval('Matches.update({\'_id\':m._id},{$set:{\'holes.h'+m.hole+'.event.predict\':predictedstatus,\'predict\':predictedstatus}})');
            break; 
    case 'powers': 
            var yr = 2000+parseInt(y.matchID/100);
            if (y.matchID>1200){var E = Math.abs(y.status);} //boost equal to the match result
            else {var E = 5;}//JTS fixed 4/22
            
            var e = Cups.findOne({year:yr,event:info.event});
                var DPp; var DPo; var DPt; var WL; var DPt1 = [0]; var DPt2 = [0];
                var ptsavail = eval('e.formats.'+y.type+'.points');
                    ptsavail = ptsavail[0]+ptsavail[1]+ptsavail[2];
            
                    var f = [y.T1pts/(ptsavail),y.T2pts/(ptsavail)];
            
                    if (f[0]+f[1]>=1){ //if all points have been given    
                        var year=parseInt(2000+y.matchID/100);
                        //Get Draft Percentages
                        var im = 0;
                        y.T1.forEach(function(m){
                            var z = Members.findOne({name:m,event:info.event}); 
                            //console.log(eval('z.stats.y'+year+'.draft'));
                            var perc = eval('z.stats.y'+year+'.draft.perc');
                            DPt1[im]=perc; im++;
                        }) 
                        im=0;
                        y.T2.forEach(function(m){
                            var z = Members.findOne({name:m,event:info.event}); 
                            //console.log(eval('z.stats.y'+year+'.draft'));
                            var perc = eval('z.stats.y'+year+'.draft.perc');
                            DPt2[im]=perc; im++;
                        }) 
                        DPt = average(DPt1); DPo = average(DPt2);
                        var dDP = Math.abs(DPt-DPo);
                        
                        //Calc sorting var
                            if (DPt==DPo){var sorter = 0;}
                            if (DPt> DPo){var sorter = 1;}
                            if (DPt <DPo){var sorter = 2;}
                        
                        var A = [0,0];//adjustment
                        switch (sorter){
                            case 2: //t2 is better
                                A = [E,E+dDP];
                            break;
                            case 1: //t1 is better
                                A = [(E+dDP),E];
                            break;
                            case 0: //same talent
                                A = [E,E];
                            break;    
                        }
                        //Update Powers
                        Matches.update({_id:y._id},{$set:{'stats.powerT1':add2array(DPt1,f[0]*(dDP+2*E)-A[0]),'stats.powerT2':add2array(DPt2,f[1]*(dDP+2*E)-A[1])}});
                            if (debug) {
                                console.log("======="+y.matchID + ": " + y.T1 + y.T1pts+" vs " + y.T2 + y.T2pts + "=========");
                                console.log("=======F: "+f + "    dDP: " + dDP + " E: " + E + "=========");
                                console.log("T1 DP:" + DPt1 + " T1 PWR: " + add2array(DPt1,f[0]*(dDP+2*E)-A[0]));
                                console.log("T2 DP:" + DPt2 + " T2 PWR: " + add2array(DPt2,f[1]*(dDP+2*E)-A[1]));
                                console.log("====================================");
                            }
                        } //if not all points have been given, set all to draft percentages
                    else {
                            var year=parseInt(2000+y.matchID/100);
                            //Get Draft Percentages
                            var im = 0;
                            y.T1.forEach(function(m){
                                var z = Members.findOne({name:m,event:info.event}); 
                                //console.log(eval('z.stats.y'+year+'.draft'));
                                var perc = eval('z.stats.y'+year+'.draft.perc');
                                DPt1[im]=perc; im++;
                            }) 
                            im=0;
                            y.T2.forEach(function(m){
                                var z = Members.findOne({name:m,event:info.event}); 
                                //console.log(eval('z.stats.y'+year+'.draft'));
                                var perc = eval('z.stats.y'+year+'.draft.perc');
                                DPt2[im]=perc; im++;
                            }) 
                            DPt = average(DPt1); DPo = average(DPt2);
                        
                            Matches.update({_id:y._id},{$set:{'stats.powerT1':DPt1,'stats.powerT2':DPt2}});
                            if (debug){
                                console.log("======="+y.matchID + ": " + y.T1+" vs " + y.T2 + "=========");
                                console.log("=======DPt1: "+DPt1 + " DPt2: " + DPt2 +"============");
                                console.log("Match not finished...");
                            } 
                         }
                       
    break;        
    case 'powers2': 
            if (info.matchID>1200){var E = Math.abs(y.status);} //boost equal to the match result
            else {var E = 5;}//JTS fixed 4/22
            
            var e = Cups.findOne({year:yr,event:info.event});
            var cumpowers = 0; var cummatches = 0;
            var powers = 0; var matches = 0; var power; 
                var DPp; var DPo; var DPt; var WL; var DP11; var DP12=0; var DP21; var DP22=0; var DPt1 = [0]; var DPt2 = [0];
                var ptsavail = eval('e.formats.'+y.type+'.points');
                    ptsavail = ptsavail[0]+ptsavail[1]+ptsavail[2];
            
                    var T1count = 1;var T2count = 1;
                    var pgive = y.T1pts + y.T2pts;
                    if (pgive){ //if points have been given
                    var year=parseInt(2000+y.matchID/100);
                    WL1 = y.T1pts/(pgive)*ptsavail-1; WL2 = y.T2pts/(pgive)*ptsavail-1;
                        
                    var im = 0;
                    y.T1.forEach(function(m){
                        var z = Members.findOne({name:m,event:info.event}); 
                        //console.log(eval('z.stats.y'+year+'.draft'));
                        var perc = eval('z.stats.y'+year+'.draft.perc');
                        DPt1[im]=perc; im++;
                    }) 
                    im=0;
                    y.T2.forEach(function(m){
                        var z = Members.findOne({name:m,event:info.event}); 
                        //console.log(eval('z.stats.y'+year+'.draft'));
                        var perc = eval('z.stats.y'+year+'.draft.perc');
                        DPt2[im]=perc; im++;
                    }) 
                    DPp = average(DPt1); DPo = average(DPt2);
                        if (DPo>DPp) {var T1ch = WL1*(WL1>WL2)*Math.abs(  DPo-DPp);}
                        if (DPp>=DPo) {var T1ch = WL1*(WL2>WL1)*Math.max(0,DPp-DPo);}
                        //console.log("DPt1" + DPt1 + " : " + T1ch + " : " + WL1 + " : " + E); console.log(add2array(DPt1,T1ch+WL1*E)); 
                    Matches.update({_id:y._id},{$set:{'stats.powerT1':add2array(DPt1,T1ch+WL1*E)}});
                        
                        
                    DPo = average(DPt1); DPp = average(DPt2);                   
                    if (DPo>DPp) {var T2ch = WL2*(WL2>WL1)*Math.abs(  DPo-DPp);}
                    if (DPp>=DPo) {var T2ch = WL2*(WL1>WL2)*Math.max(0,DPo-DPp);}
                                                //console.log("DPt2" + DPt2 + " : " + T2ch + ":" + WL2 + ":" + E); console.log(add2array(DPt2,T2ch+WL2*E));
                                                //console.log("DP22" + DP22 + " : "); console.log(DP22+T2ch+WL2*E);
                    Matches.update({_id:y._id},{$set:{'stats.powerT2':add2array(DPt2,T2ch+WL2*E)}});
                    } //if points haven't been given, set all to zero
                    else {Matches.update({_id:y._id},{$set:{'stats.powerT1':[0,0],'stats.powerT2':[0,0]}});}
    break;
    } //end switch
    })//endtypeloop            
     })                  
}, //end updatematch
    
    
    updateteamstats(info,type){
        if (debug){
                console.log('=====UPDATING TEAM STATS=====')
                console.log(type+" "+ info.year+" defending: "+info.defending);
                  }
    
    var y = Rosters.findOne({year:info.year, defending:info.defending, event:info.event}); var members; var cursor2; var ID;
    //console.log(y);
       //console.log('found roster');
       members = y.members; ID = y._id;
        //console.log(members);
       cursor2 = Members.find({name:{$in:members},event:info.event})
    type.forEach(function(t){
    var value = 0; var k = 0;
    cursor2.forEach(function(x){
    switch (t) {
    case 'winperc':
            if (x.stats.winperc !== "N"){
            value = value + x.stats.winperc; k++;
                if (debug){console.log(x.name +  x.stats.winperc);}
            }
            break;
    case 'singlesperc':
            if (x.stats.singles.perc !== "N"){    
            value = value + x.stats.singles.perc; k++;
                if (debug){console.log(x.name +  x.stats.singles.perc);}
            }
            break;
    case 'bestballperc':
            if (x.stats.bestball.perc !== "N"){    
            value = value + x.stats.bestball.perc; k++;
                if (debug){console.log(x.name +  x.stats.bestball.perc);}
            }
            break;
    case 'shambleperc':
            if (x.stats.shamble.perc !== "N"){    
            value = value + x.stats.shamble.perc; k++;
                if (debug){console.log(x.name +  x.stats.shamble.perc);}
            }
            break;
    case 'scramble4manperc':
            if (x.stats.scramble4man.perc !== "N"){    
            value = value + x.stats.scramble4man.perc; k++;
                if (debug){console.log(x.name +  x.stats.scramble4man.perc);}
            }
            break; 
    case 'scramble2manperc':
            if (x.stats.scramble2man.perc !== "N"){    
            value = value + x.stats.scramble2man.perc; k++;
                if (debug){console.log(x.name +  x.stats.scramble2man.perc);}
            }
            break;         
    case 'tenure':
            if (x.stats.tenure !== "N"){    
            value = value + x.stats.tenure; k++;
                if (debug){console.log(x.name +  x.stats.tenure);}
            }
            break;
    case 'power':
            if (x.stats.power !== "N"){    
            //console.log(x.name + "PWR: " + x.stats.power);
            value = value + x.stats.power; k++;
                if (debug){console.log(x.name +  x.stats.power);}
            }
            break;
    case 'impact':
            if (x.stats.impact !== "N"){
            value = value + x.stats.impact; k++;
                if (debug){console.log(x.name +  x.stats.impact);}
            }
            break;
    case 'draftperc':
            if (x.stats.draftperc !== "N"){    
            value = value + x.stats.draftperc; k++;
                if (debug){console.log(x.name +  x.stats.draftperc);}
            }
            break;
    }  //end switch
        
    }) //end forEach2        
    
    eval("Rosters.update({_id:ID},{$set:{\"stats."+t+"\":value/k}})");
        if (debug) {console.log(t+"updated for"+y.description+"in"+y.year+": "+value/k);}
        }) //endtypeloop
    //console.log('found update');      
},//updateteam

updatestroke(info){

    var y = Matches.findOne({matchID:info.matchID,event:info.event});
    var z = Courses.findOne({description:info.course});
    var status = 0; var net = 0; var h; var cres; var cnet;
    //for (var i=1;i<19;i++){ //jts, july18: i don't know why i was doing it like this for strokeplay
    //    if (eval('y.holes.h'+i+'.result') > 0) {
    //        
    //        cres = parseInt(eval('y.holes.h'+i+'.result'));
    //        status = status + (cres-z.par[i-1]);
    //        cnet = parseInt(eval('y.holes.h'+i+'.net'));
    //        net =    net    + (cnet-z.par[i-1]);
    //        console.log(y.matchID,i,status,net);
    //    }        
    //    else {break;}
    //}
    for (var i=0; i<y.result.length; i++){          
            cres = parseInt(y.result[i]);
            status = status + (cres-z.par[i]);
            cnet = parseInt(y.net[i]);
            net =    net    + (cnet-z.par[i]);
            //console.log(y.matchID,i,status,net);    
    }
    Matches.update({_id:y._id},{$set:{status:status,netstatus:net,hole:y.result.length}});

},
    

updatememberstats(info,type){    
    if (info.name == "all") {var cursor = Members.find({event:info.event});}
    else if (info.name.constructor == Array) {var name = info.name; var cursor = Members.find({name:{$in:name},event:info.event}); //console.log("name: "+ name);
                                             }
    else {var cursor = Members.find({name:info.name,event:info.event});}
    //console.log('entered memberstats');
    
    
    //JTS HERE -- SOME MEMBERS DON"T HAVE ALL DRAFT POSITIONS (SEE BRET 2008)
    type.forEach(function(t){
    switch (t) {
    case 'cuprecord':
            var years = yearsarray(info.event); years = years.reverse();
            cursor.forEach(function(x){ var record = [0,0];
                for (var i=0;i<years.length;i++){
                    var year = years[i];
                    var r = Rosters.findOne({year:year,event:info.event,members:{$in:[x.name]}});
                    if (r !== undefined){
                        //console.log(x.name + ' played on ' + r.description + ' in ' + r.year + "; result: " + r.winner);
                        eval("Members.update({_id:\""+x._id+"\"},{$set:{\"stats.y"+year+".cuprecord\":"+r.winner+"}});");
                        if (r.winner == 0) {record[1]=record[1]+1;}
                        if (r.winner == 1) {record[0]=record[0]+1;}
                    }
                    else {//console.log(year + x.name);
                        eval("Members.update({_id:\""+x._id+"\"},{$set:{\"stats.y"+year+".cuprecord\":0}});");
                         }
                }
                Members.update({_id:x._id},{$set:{'stats.cuprecord':record}});
                //console.log(x.name + 's overall cup record is ' +record);
            })
            break;        
    case 'draftPos2':
            var years = yearsarray(info.event); years = years.reverse();
            //console.log(years);
            cursor.forEach(function(x){
                for (var i=0;i<years.length;i++){
                    var year = years[i];
                    var r = Rosters.findOne({year:year,event:info.event,members:{$in:[x.name]}});
                    if (eval("x.draftPos2"+year)>-1){
                        //console.log(eval("x.draftPos2"+year));
                        var pos = eval("x.draftPos2"+year);
                        eval("Members.update({_id:\""+x._id+"\"},{$set:{\"draftPos2.y"+year+"\":"+pos+"}});");
                    }
                    else {
                        //console.log(year + x.name);
                        eval("Members.update({_id:\""+x._id+"\"},{$set:{\"draftPos2.y"+year+"\":\"N\"}});");}
                }
            })
            break;
    case 'draftperc2': 
        var r = Rosters.findOne({year:info.year,defending:info.defending});
            //console.log(r)
        var numactive = eval('Members.find({event:info.event,\'stats.y'+info.year+'.active\':1}).count();');    
        for (var i=1;i<r.members.length;i++){
            var m = Members.findOne({name:r.members[i],event:info.event});
            var dP = eval('m.stats.y'+info.year+'.draft.pos');
            var draftperc = 100*(1-(dP-1)/(numactive-2-1));
            //console.log(m.name,dP,numactive,draftperc);
            eval('Members.update({_id:m._id},{$set:{\'stats.y'+info.year+'.draft.perc\':draftperc}});');
        }    
        break;    
    case 'draftperc':
        var years = yearsarray(info.event); years = years.reverse();
        cursor.forEach(function(x){
            var draftpercs = 0; var k = 0; var fieldsize;
            for (var i = 0; i<years.length; i++){
                var year = years[i];
                //only process if that member is active that year
                if (eval("x.stats.y" +year+".active") & eval("x.stats.y" +year+".draft.pos")>-2) {  
                    var currdraftPos = eval("x.stats.y" +year+".draft.pos");
                    var numactive = eval('Members.find({event:info.event,\'stats.y'+year+'.active\':1}).count();');
                    var currdraftperc = 100*(1-(currdraftPos-1)/(numactive-2-1));
                    // Give non-2007 captains the previous year's draftperc. Give inaugural captains a 70.
                    if (currdraftPos<=0 && i>0) {
                        eval('currdraftperc = x.stats.y'+years[i-1]+'.draft.perc');
                        //console.log(x.name,currdraftperc);
                        eval('Members.update({_id:x._id},{ $set:{\'stats.y'+year+'.draft.perc\':currdraftperc}});');
                    }
                    if (currdraftPos<=0 && i==0) {
                        if (x.name == "Alex Rechtin" | x.name == "Greg Turcotte") {currdraftperc=100;}
                        else { currdraftperc=70;}
                        //console.log(x.name,year,'forced to', currdraftperc)
                        eval('Members.update({_id:x._id},{ $set:{\'stats.y'+year+'.draft.perc\':currdraftperc}});');
                    }   
                          
                    draftpercs = draftpercs + currdraftperc; k++; 
                    //console.log('UpdateMember, DraftPerc: '+ year+ x.name + currdraftperc); 
                }
                else {
                   eval('Members.update({ _id: x._id },{ $set: {\'stats.y'+year+'.draft.pos\':"N",\'stats.y'+year+'.draft.perc\':0}});');
                   //console.log('UpdateMember, DraftPerc: '+ year+ x.name + "NOT ACTIVE"); 
                }
               
            }
            
            Members.update({_id:x._id}, { $set: { "stats.draftperc": draftpercs/k } } );
            if (debug) {console.log('UpdateMember, DraftPerc: '+ x.name + ', '+ draftpercs/k+' over ' + k+' years');}
        //console.log(x.powers[0].y2014[0].Commissioner);
        //Members.update({_id:x._id}, { $set: { "stats.draftperc": Object.keys(x.draftPos2[0]).length } } )
        })
    break; 
    case 'active': //jtsdone
        //console.log("ACTIVE") 
        cursor.forEach(function(x){
            var years = yearsarray(info.event); years = years.reverse(); 
            years.forEach(function(y){ var active=0;
                if (eval('x.active.y'+y)){var active=1;}
                eval("Members.update({_id:x._id}, { $set: {\"stats.y"+y+".active\":"+active+"  } } )");
            })
        })
            break;
            
    case 'tenure': //jtsdone
        //console.log("TENURE") 
        cursor.forEach(function(x){
            var years = yearsarray(info.event); years = years.reverse(); var tenure = 0;
            years.forEach(function(y){
                tenure = tenure + parseInt(eval('x.stats.y'+y+'.active'));
            })
            Members.update({_id:x._id}, { $set: { "stats.tenure": tenure } } );
            //console.log(x.name+tenure);
        })
        
    break;
    case 'power': //jtsdone
        //Grabs match powers and computes member powers.
        var years = yearsarray(info.event); years = years.reverse();
        cursor.forEach(function(x){
            var cumpowers = 0; var cumyears = 0; var cumimpact = 0;
        for (var i=0; i<years.length;i++){
            var year = years[i];
            var powers = 0; var matches = 0; var yearidx = 100*(year-2000); var ID; var power = 0;
             var cursor2 = Matches.find({ $and: [ {$or:[{T1:x.name},{T2:x.name}]}, {matchID:{$gt:yearidx,$lt:yearidx+100}}], event:info.event });
            
            cursor2.forEach(function(y){
                //console.log('entered'+y.matchID);
                if (y.hole>0) {
                    var it =0;
                    y.T1.forEach(function(m){
                         if (x.name == m){power = y.stats.powerT1[it]; //console.log(power);
                                         }
                         it++;
                    }) 
                    it=0;
                    y.T2.forEach(function(m){
                         if (x.name == m){power = y.stats.powerT2[it];  //console.log(power);
                                         }
                         it++;
                    })
                    powers = powers + power; matches++;
                }
                //console.log(power + " " + matches);
            })
            if (matches>0) {var avgpower = powers/matches; cumyears++; cumpowers = cumpowers + avgpower;}
            else {
                var avgpower = eval('x.stats.y'+year+'.draft.perc');
            }
            
            //console.log("y"+idx+":"+avgpower);
            eval("Members.update({_id:x._id}, { $set: {\"stats.y"+year+".power\":avgpower } } )");
            
            var impact = avgpower-eval('x.stats.y'+year+'.draft.perc');
            cumimpact = cumimpact + impact;
            //console.log("impact"+idx+":"+impact);
            eval("Members.update({_id:x._id}, { $set: {\"stats.y"+year+".impact\":impact } } )");
            
            if (debug) {
                console.log('UpdatePower',x.name,year,"impact",impact,"power",avgpower);
            }
        } //end for years
            var avgcumpower = cumpowers/cumyears; var avgcumimpact = cumimpact/cumyears;
            if (!isNaN(avgcumpower)) {Members.update({_id:x._id}, { $set: { "stats.power": avgcumpower } } );}
            else {var avgcumpower = 0;Members.update({_id:x._id}, { $set: { "stats.power": 50 } } );}
            //console.log(avgcumpower);
        
        if (!isNaN(avgcumimpact)) {Members.update({_id:x._id}, { $set: { "stats.impact": avgcumimpact } } );}
        else {var avgcumimpact = 0;Members.update({_id:x._id}, { $set: { "stats.impact": 0 } } );}
            
        //console.log(x.name + "Fimpact" + avgcumimpact);
        //console.log(x.name + "Fpower" + avgcumpower);
        })
    break;
    case 'points': //jtsdone 4/21
            var years = yearsarray(info.event); years = years.reverse();
            var e = Cups.findOne({year:years[0], event:info.event});  
            var types = Object.keys(e.formats); 
        cursor.forEach(function(x){
            var Fpoints =0; var Favail=0;
            types.forEach(function(f){
                    //var cumpoints = 0; var cumavail = 0;
                var cumpoints =0; var cumavail =0;
            for (var i=0;i<years.length;i++){
                var year = years[i]; 
                var e = Cups.findOne({year:year, event:info.event});    
                var points = 0; var avail = 0; var yearidx = 100*(year-2000);
                var cursor2 = Matches.find({ $and: [ {T1:x.name}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:f}], event:info.event });
                cursor2.forEach(function(y){points = points + y.T1pts/y.T1.length; avail = avail + sumarray(eval('e.formats.'+f+'.points'))/y.T1.length;})
                var cursor2 = Matches.find({ $and: [ {T2:x.name}, {matchID:{$gt:yearidx,$lt:yearidx+100}},{type:f}], event:info.event });
                cursor2.forEach(function(y){points = points + y.T2pts/y.T2.length; avail = avail + sumarray(eval('e.formats.'+f+'.points'))/y.T2.length;})
                if (avail == 0){var perc ='N';} 
                    else {var perc = 100*points/avail;}
                eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+"."+f+".points\": points } } )");
                eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+"."+f+".perc\": perc } } )");
                eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+"."+f+".avail\": avail } } )");    
                cumpoints = cumpoints + points; cumavail = cumavail + avail;
                
                //console.log(x.name +year+ f + points+ " " + perc);
                    if (debug) {
                        console.log('cumpoints:  ' + cumpoints);
                        console.log('UpdatePoints',x.name,year,f,"points",points,"perc",perc,"avail",avail);
                    }
                if (cumavail == 0){var perc = 'N';} 
                else {var perc = 100*cumpoints/cumavail;}
                
                    Fpoints = Fpoints + points; Favail = Favail + avail;
            }
                eval("Members.update({_id:x._id}, { $set: { \"stats."+f+".points\": cumpoints } } )");
                eval("Members.update({_id:x._id}, { $set: { \"stats."+f+".perc\": perc } } )");
                console.log('updated ' + x._id + 'points: ' + cumpoints);
            })
            if (Favail == 0){var perc = 'N';} 
            else {var perc = 100*Fpoints/Favail;}
            Members.update({_id:x._id}, { $set: {'stats.points': Fpoints} } );
                if (debug) {
                    console.log("ALLPOINTS: ",Fpoints,"ALLAVAIL",Favail,"ALLPERC",perc);
                }
        })
        
    break;        
    
    case 'winperc': //updates member overall points and winperc
        var years = yearsarray(info.event); years = years.reverse();
        cursor.forEach(function(x){
            var cumpoints = 0; var cumavail = 0;
        for (var i = 0; i<years.length; i++){
            var year = years[i];
            var e = Cups.findOne({year:year,event:info.event});
            var points = 0; var avail = 0; var yearidx = 100*(year-2000);
            var cursor2 = Matches.find({ $and: [ {T1:x.name}, {matchID:{$gt:yearidx,$lt:yearidx+100}}],event:info.event});
            cursor2.forEach(function(y){points = points + y.T1pts; avail = avail + sumarray(eval('e.formats.'+y.type+'.points'));})
            var cursor2 = Matches.find({ $and: [ {T2:x.name}, {matchID:{$gt:yearidx,$lt:yearidx+100}}],event:info.event});
            cursor2.forEach(function(y){points = points + y.T2pts; avail = avail + sumarray(eval('e.formats.'+y.type+'.points'));})
            if (avail){
                //eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+"\.points": points } } )");
                eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+".winperc\": 100*points/avail } } )");
            } else {
                //eval("Members.update({_id:x._id}, { $unset: { \"points.y"+year+"\": 0 } } )");
                eval("Members.update({_id:x._id}, { $set: { \"stats.y"+year+".winperc\": 0 } } )");
            }
            
            cumpoints = cumpoints + points; cumavail = cumavail + avail;
            //console.log(year+x.name+'updated player'+points);
        }
        Members.update({_id:x._id}, { $set: { "stats.points": cumpoints } } );
        Members.update({_id:x._id}, { $set: { "stats.winperc": 100*cumpoints/cumavail } } );
            //console.log("TOTAL"+year+x.name+'updated player'+points);
        })
    break;
            
    }
    })//end type loop
        
},//updatememberstats

updatecup(info,type){
    var year = parseInt(info.matchID/100)+2000;
    var cup = Cups.findOne({year:year,event:info.event});
    type.forEach(function(t){
            //console.log('CupUpdate:'+t+' | matchID' + info.matchID);
    switch (t){ 
    case 'MVP':
            console.log('entered MVP');
        var MVP = ["",""];
        var r = Rosters.find({year:year,event:info.event});
            r.forEach(function(R){
                var m = eval('Members.findOne({event:info.event,name:{$in:R.members}},{sort:{\'stats.y'+year+'.impact\':-1},limit:1});');
                //console.log(R.members)
                MVP[R.defending] = m.name;
            })
            MVP = MVP.reverse();
            Cups.update({_id:cup._id},{$set:{MVP:MVP}});
            break;
    case 'points':
        //update points in bulk fashion
        var yridx = (year-2000)*100; var T1pts = 0; var T2pts = 0; 
        var T1ptsDAY = [0,0,0]; var T2ptsDAY = [0,0,0]; var matchtype; var names;
        var cursor = Matches.find({matchID:{$gt:yridx,$lt:yridx+100},event:info.event});
        cursor.forEach(function(m){
            T1pts = T1pts + m.T1pts; T2pts = T2pts + m.T2pts;
            T1ptsDAY[m.day-1]= T1ptsDAY[m.day-1]+m.T1pts;
            T2ptsDAY[m.day-1]= T2ptsDAY[m.day-1]+m.T2pts;
        })
        //console.log('updatecuppoints');
        Cups.update({_id:cup._id},{$set:{T1pts:T1pts,T2pts:T2pts, T1ptsDAY:T1ptsDAY, T2ptsDAY:T2ptsDAY}});

        
        Meteor.call('updatematch',{event:info.event,matchID:info.matchID},['powers']);  
        //updatematch({event:info.event, matchID:info.matchID}, 'holes');    
        var y = Matches.findOne({matchID:info.matchID,event:info.event});  
        var types = ['points','power','winperc'];//,'power','tenure','singlespoints','bestballpoints','shamblepoints'];
        Meteor.call('updatememberstats',{name:y.T1.concat(y.T2),event:info.event},types);   
        Meteor.call('updatecup',{event:info.event,matchID:info.matchID},['MVP']);   
    break;
    case 'leads': //also does projected points
        //update points in bulk fashion
        //console.log('LEADS');
        var yr = parseInt(info.matchID/100)+2000;
        var yridx = parseInt(info.matchID/100)*100; var T1pts = 0; var T2pts = 0; 
        var e = Cups.findOne({year:yr,event:info.event});    
        var T1predict = 0; var T2predict = 0;
        var T1leads = 0; var T2leads = 0; var ties = 0;
        var cursor = Matches.find({matchID:{$gt:yridx,$lt:yridx+100},event:info.event},{sort:{matchID:1}});
        cursor.forEach(function(m){
            T1pts = T1pts + m.T1pts; T2pts = T2pts + m.T2pts;
            // Update leads + ties            
            var ptsavail = sumarray(eval('e.formats.'+m.type+'.points'));
            var ptsrem = (ptsavail-(m.T1pts+m.T2pts));
            if (m.status >0){var f1 = 1; var f2 = 0; T1leads = T1leads + (ptsrem>0 & m.hole>0); //console.log('t1'+ (ptsrem>0 & m.hole>0));
                            }
            if (m.status <0){var f1 = 0; var f2 = 1; T2leads = T2leads + (ptsrem>0 & m.hole>0); //console.log('t2'+ (ptsrem>0 & m.hole>0));
                            }
            if (m.status==0){var f1 = 0.5; var f2 = 0.5; ties = ties + (ptsrem>0 & m.hole>0); //console.log('tie'+ (ptsrem>0 & m.hole>0));
                            }
            T1predict = m.T1pts + T1predict + f1*ptsrem; 
            T2predict = m.T2pts + T2predict + f2*ptsrem;
            //console.log(m.matchID + "leading" + (ptsrem>0 & m.hole>0) + " " +  f1*ptsrem + " " + f2*ptsrem)
            
        })
        Cups.update({_id:cup._id},{$set:{T1leads:T1leads,T2leads:T2leads,ties:ties,T1predict:T1predict,T2predict:T2predict}});
    break;
    }//end switch
    })//endforEach
},
    
//Insert document into History collection containing a snapshot of information from the instance the function is called
snapshot(info) {
    if (debug) {console.log('Adding snapshot for ',info.matchID)}
    var year = parseInt(info.matchID/100)+2000;
    var cup = Cups.find({year:year,event:info.event});
    var d = info.time; var screenName;
    if (info.user == null) {screenName = "";}
    else { if (info.user.services.twitter == undefined) {screenName == info.user.emails[0].address;}
           else {screenName = info.user.services.twitter.screenName;}
         }
    if (debug) {console.log('Hole change by: ',screenName)}
    
    var match=Matches.findOne({matchID:info.matchID,event:info.event});
        if (match.matchID > 0){var cup    = Cups.findOne({year:year,event:info.event});}
        else                  {var cup    = Exhibitions.findOne({unique:match.matchID[0],event:info.event});}
    var location = { "type": "Point",
                     "coordinates": [info.latlong[0],info.latlong[1]],
                     "accuracy":info.latlong[2]
                   };
    if (debug) {console.log('Uploaded at: ',location.coordinates)}
    History.insert({"location": location,
                    "type":info.type,
                    "time":d,
                    "user":info.user,
                    "matchID": match.matchID,
                    "match_status": match.status,
                    "match_netstatus": match.netstatus,
                    "match_hole": match.hole,
                    "event": info.event,
                    "event_status": [cup.T1pts, cup.T2pts],
                    "event_leads": [cup.T1leads, cup.T2leads, cup.ties],
                    "event_proj": [cup.T1predict, cup.T2predict],
                    "MVP":cup.MVP
                   }
                  );
    if (debug) {console.log('Snapshot done...')}
}

    
})//end meteor methods