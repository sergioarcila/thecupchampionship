//import Highcharts from 'highcharts';
    
    Template.analysis.onRendered(function() {
        Meteor.subscribe('history',{year:Session.get('selectedYear'),event:Session.get('currentevent')});
        Meteor.subscribe('rosters',Session.get('currentevent'));
        Meteor.subscribe('matches',{event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'});
        Session.set('analysistype','status');
        
        
    });


function random() {
    return Math.floor((Math.random() * 100) + 1);
}

Template.analysis.helpers({
'hasStarted': function(){
    var c = Cups.findOne({year:Session.get('selectedYear'),event:Session.get('currentevent')})
    return c.T1pts+c.T2pts
},
    
   'createChart': function () {
      // Gather data: 
      
       
      // Use Meteor.defer() to craete chart after DOM is ready:
      //Meteor.defer(function() {
          
          var a = 'event_status';
          //var b = 'event_proj';
          
        
        var yridx = 100*(Session.get('selectedYear')-2000);
    var m = Matches.find({day:2,matchID:{$gt:yridx,$lt:yridx+100},event:Session.get('currentevent')},{matchID:1});
        var mids = []; var i =0;
        m.forEach(function(mm){mids[i] = mm.matchID; i++;})
        //console.log(mids);
    var p = History.find({matchID:{$in:mids}},{sort:{time:1}}); var t = []; var d1 = []; var d2 = []; var i =0; var ids = []; var T1val; var T2val;
    p.forEach(function(hh){
            T1val = eval('hh.'+a+'[0];'); T2val = eval('hh.'+a+'[1];');
            if (T1val !== dd1 || T2val !== dd2){
                //t[i]=hh.time.getHours() + ":" + hh.time.getMinutes(); 
                t[i]=60*hh.time.getHours() + hh.time.getMinutes(); 
                //console.log(t[i],hh.MVP);
                d1[i]=T1val; 
                d2[i]=T2val; 
                ids[i] = hh._id;
                dd1 = d1[i]; dd2=d2[i];
                i++;            
            }
                          })
    var r1 = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:1});
    var r2 = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:0});    
 
    var m = Matches.find({day:1,matchID:{$gt:yridx,$lt:yridx+100},event:Session.get('currentevent')},{matchID:1});
        var mids = []; var i =0;
        m.forEach(function(mm){mids[i] = mm.matchID; i++;})
        //console.log(mids);
    var p = History.find({matchID:{$in:mids}},{sort:{time:1}}); 
    var t = []; var d1 = []; var d2 = []; var dd1=[]; var dd2=[]; var i =0;  var D1 = []; var D2=[]; var T1 = [];var T2 = []; var H = [];
    p.forEach(function(hh){
        if (hh.event_status[0] !== dd1 || hh.event_status[1] !== dd2){
            //t[i]=hh.time.getHours() + ":" + hh.time.getMinutes(); 
            t[i]=hh.time;
            d1[i]=eval('hh.'+a+'[0];'); 
            d2[i]=eval('hh.'+a+'[1];'); 
                    var m = Matches.findOne({matchID:hh.matchID,event:hh.event},{stats:-1});
                    T1[i] = m.T1; T2[i] = m.T2; H[i] = h.match_hole;
            
            dd1 = d1[i]; dd2=d2[i];
            D1[i] = [Date.UTC(hh.time.getYear(),hh.time.getMonth(),hh.time.getDate(),hh.time.getHours(),hh.time.getMinutes()), eval('hh.'+a+'[0];')];
            D2[i] = [Date.UTC(hh.time.getYear(),hh.time.getMonth(),hh.time.getDate(),hh.time.getHours(),hh.time.getMinutes()), eval('hh.'+a+'[1];')];
            //console.log(hh);
            i++;            
        }
        })
    
        // Create standard Highcharts chart with options:
          //console.log(D);
          //console.log(elevationData);
          // Now create the chart
Highcharts.chart('chart', {

    chart: {
        type: 'area',
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        scrollablePlotArea: {
            minWidth: 200
        }
    },

    title: {
        text: 'Friday Matches'
    },

    subtitle: {
        text: 'The Cup Championship, 2018'
    },

    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy yearminute: 
            day: '%H:%M'
        },
        //min:t[0],
        //max:t[t.length],
        //maxPadding: 0.5,
        title: {
            text: 'Time'
        }
    },

    yAxis: {
        startOnTick: false,
        endOnTick: true,
        maxPadding: 0.2,
        title: {
            text: 'Projected Points',
            margin:0,
            x:-10
        },
        labels: {
            format: '{value}'
        }
    },

    tooltip: {
        padding:16,
        xDateFormat: '%H:%M',
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><table>',
        pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2
    },

    legend: {
        enabled: false
    },

    series: [{
        data: D1,//elevationData,
        lineColor: Highcharts.getOptions().colors[1],
        color: Highcharts.getOptions().colors[1],
        fillOpacity: 0.5,
        name: 'Elevation',
        marker: {
            enabled: false
        },
        threshold: null
    },{
        data: D2,//elevationData,
        lineColor: Highcharts.getOptions().colors[2],
        color: Highcharts.getOptions().colors[2],
        fillOpacity: 0.5,
        name: 'Elevation',
        marker: {
            enabled: false
        },
        threshold: null
    }]
    
});
          
      //});
    } 
    

})


var myChart = null;
Template.analysis.events({
    'click .refreshchart': function(event){
      var a = event.target.id;
      if (a == 'event_status'){var y_ax_lab = "Points Earned";Session.set('analysistype','status');}
      if (a == 'event_proj'){  var y_ax_lab = "Projected Points";Session.set('analysistype','proj');}
      Meteor.subscribe('history',{year:Session.get('selectedYear'),event:Session.get('currentevent')});
      Meteor.subscribe('rosters',Session.get('currentevent'));
      Meteor.subscribe('matches',{event:Session.get('currentevent'),year:Session.get('selectedYear'),name:'all'});
    
      if(myChart!=null){
        myChart.destroy();
        }
        
      var ctx  = document.getElementById("myChart").getContext("2d");
      ctx.canvas.width = "100%";
      ctx.canvas.height = "100%";
      var ctx2  = document.getElementById("myChart2").getContext("2d");
      ctx2.canvas.width = "100%";
      ctx2.canvas.height = "100%"; 
      
    
      var options = {
        responsive: true,
        maintainAspectRatio: false,
        title:{display:false,text:'Scoring Timeline'},
        
        tooltips: {
            intersect:true,
            callbacks: {
                label:      function(tooltipItem, data)  {
                    var out = [];
                    var h = History.findOne({_id:data.datasets[0].extra[tooltipItem.index]});
                    var m = Matches.findOne({matchID:h.matchID,event:h.event},{stats:-1});
                    var str0 = m.T1 + " vs. " + m.T2; 
                    var str1 = "Hole " + h.match_hole;
                    var tooltip = new Array(str0, str1);
                    return tooltip
                },
                labelColor: function(tooltipItem, chart) {
                    return {
                        borderColor: 'rgb(255, 0, 0)',
                        backgroundColor: 'rgb(255, 0, 0)'
                    }
                }
            }
        },
        scales: {
                    xAxes: [{
                        time: {
                            unit: 'minute',
                            displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                        },
                        distribution: 'linear',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: y_ax_lab
                        }
                    }]
                }
          
        };
    var yridx = 100*(Session.get('selectedYear')-2000);
    var m = Matches.find({day:2,matchID:{$gt:yridx,$lt:yridx+100},event:Session.get('currentevent')},{matchID:1});
        var mids = []; var i =0;
        m.forEach(function(mm){mids[i] = mm.matchID; i++;})
        //console.log(mids);
    var p = History.find({matchID:{$in:mids}},{sort:{time:1}}); var t = []; var d1 = []; var d2 = []; var i =0; var ids = []; var T1val; var T2val;
    p.forEach(function(hh){
            T1val = eval('hh.'+a+'[0];'); T2val = eval('hh.'+a+'[1];');
            if (T1val !== dd1 || T2val !== dd2){
                //t[i]=hh.time.getHours() + ":" + hh.time.getMinutes(); 
                t[i]=60*hh.time.getHours() + hh.time.getMinutes(); 
                //console.log(t[i],hh.MVP);
                d1[i]=T1val; 
                d2[i]=T2val; 
                ids[i] = hh._id;
                dd1 = d1[i]; dd2=d2[i];
                i++;            
            }
                          })
    var r1 = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:1});
    var r2 = Rosters.findOne({event:Session.get('currentevent'),year:Session.get('selectedYear'),defending:0});    
    
    // Set the data
    var data = {
        labels: t,
        datasets: [{
            label: r1.description,
            backgroundColor: rgb2rgba(r1.color[0],0.25),
            data: d1,
            extra:ids
        }, {
            label: r2.description,
            backgroundColor: rgb2rgba(r2.color[0],0.25),
            data: d2
        }]
    };
    var m = Matches.find({day:1,matchID:{$gt:yridx,$lt:yridx+100},event:Session.get('currentevent')},{matchID:1});
        var mids = []; var i =0;
        m.forEach(function(mm){mids[i] = mm.matchID; i++;})
        //console.log(mids);
    var p = History.find({matchID:{$in:mids}},{sort:{time:1}}); 
    var t = []; var d1 = []; var d2 = []; var dd1=[]; var dd2=[]; var i =0; 
    p.forEach(function(hh){
        if (hh.event_status[0] !== dd1 || hh.event_status[1] !== dd2){
            //t[i]=hh.time.getHours() + ":" + hh.time.getMinutes(); 
            t[i]=60*hh.time.getHours() + hh.time.getMinutes(); 
            //console.log(hh.MVP);
            d1[i]=eval('hh.'+a+'[0];'); 
            d2[i]=eval('hh.'+a+'[1];'); 
            dd1 = d1[i]; dd2=d2[i];
            //console.log(hh);
            i++;            
        }
        })
    
    var data2 = {
        labels: t,
        pointRadius:0,
        datasets: [{
            label: r1.description,
            backgroundColor: rgb2rgba(r1.color[0],0.25),
            data: d1,pointRadius:10            
        }, {
            label: r2.description,
            backgroundColor: rgb2rgba(r2.color[0],0.25),
            data: d2
        }]
    };    
      var myLineChart = new Chart(ctx,{type:'line',data:data, options:options});
      var myLineChart2 = new Chart(ctx2,{type:'line',data:data2, options:options});    
    }

})