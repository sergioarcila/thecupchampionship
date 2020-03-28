Template.memberrow.helpers({
  lastname: function(fullname) {
    var name = fullname.split(" ");
    return name[1];
  },
  selectedClass: function(){
    var m = Members.findOne({name:this.name}); 
    var output = "";
        var selectedPlayer = Session.get('selectedPlayer');        
        if (m._id == selectedPlayer){output = "selected"}
    return output
},
 teamClass: function(){
    var selectedYear = parseInt(Session.get('selectedYear'));
    var c = Cups.findOne({year:selectedYear,event:Session.get('currentevent')});
    var T1desc = c.T1; var T2desc = c.T2;
    
    if (this.banned) {
        return "banned";
    } if (Rosters.findOne({description:T1desc, year:selectedYear, members:{$in:[this.name]}})) {
        return "T";
    } else if (Rosters.findOne({description:T2desc, year:selectedYear, members:{$in:[this.name]}})) {
        return "T";
    } else {
        return "";
    }
}
});

