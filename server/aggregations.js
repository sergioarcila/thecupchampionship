Meteor.methods({
    testserver(matchID){
        Matches.update({matchID:matchID,event:'thecup'},{$set:{'testfield':'wow'}});
    },
    getmemberstats(years,ptflags,sortstr,member,eventdescription) {
        //var sortstr = "points";
        var str_t = []; var str_pt = []; var str_d = []; var str_p = []; var str_i = []; var str_c = []; var str_a = [];
        //var ptflags = [1,1,1]; 
        
        var i = 0;
    for (var y = years[0]; y <= years[1]; y++){
        str_t[i]  = "$stats.y" + y + ".active"; 
        str_d[i]  = "$stats.y" + y + ".draft.perc"; 
        str_p[i]  = "$stats.y" + y + ".power"; 
        str_i[i]  = "$stats.y" + y + ".impact"; 
        str_c[i]  = "$stats.y" + y + ".cuprecord";
        //str_a[i]  = "$ptsavailable.y" + y;
        i++;
    } 
   
    var i = 0; var j = 0;  var k = 0;  var m = 0;            
    for (var y = years[0]; y <= years[1]; y++){
        if (ptflags[0]) {str_pt[i] = "$stats.y" + y + ".singles.points"; str_a[i] = "$stats.y" + y + ".singles.avail";  i++;}
        if (ptflags[1]) {str_pt[i] = "$stats.y" + y + ".bestball.points"; str_a[i] = "$stats.y" + y + ".bestball.avail"; i++;}
        if (ptflags[2]) {str_pt[i] = "$stats.y" + y + ".shamble.points";   str_a[i] = "$stats.y" + y + ".shamble.avail"; i++;}
    }

var matchOperator = { "$match": { } }
if (member !== 'all'){
    matchOperator["$match"]["name"] = member;
}
else {
    matchOperator["$match"]["event"] = eventdescription
}
      
var sortOperator = { "$sort": { } }
        sortOperator["$sort"][sortstr.type] = sortstr.dir;
        
var pipeline = [
    matchOperator,
    {
      $project: {
        _id: "$_id", 
        name: "$name",
      	power: {"$add":str_p},
        impact: {"$add":str_i},
        tenure: {"$add":str_t},        
        draftperc: {"$add":str_d},
        points:{"$add":str_pt},
        cupresult:{"$add":str_c},
        ptsavail:{"$add":str_a}
      }
    },
    {
      $project: {
        _id: "$_id",
        name: "$name",
        cupresult:"$cupresult",  
      	power: {$cond: { if: { $gte: [ "$tenure", 1 ] }, then: {"$divide":["$power","$tenure"]}, else: "-" }},
        impact: {$cond: { if: { $gte: [ "$tenure", 1 ] }, then: {"$divide":["$impact","$tenure"]}, else: "-" }},
        tenure: "$tenure",
        points:"$points",
        draftperc: {$cond: { if: { $gte: [ "$tenure", 1 ] }, then: {"$divide":["$draftperc","$tenure"]}, else: "-" }},
        winperc: {$cond: { if: { $gte: [ "$ptsavail", 1 ] }, then: {"$divide":["$points","$ptsavail"]}, else: "-" }}
      }
    },
    {$match: {  tenure: { $gt: 0} }  },
    
    sortOperator
];
        
//console.log(pipeline);
        
//var result = Members.aggregate(pipeline, {explain: true});
//console.log("Explain Report:", JSON.stringify(result[0]), null, 2)
return Members.aggregate(pipeline);

    }
})