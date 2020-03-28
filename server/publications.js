
Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

Meteor.publish('members', function(params) {
  if (params.name == 'all'){return Members.find({event:params.event})}
  else {return Members.find({event:params.event,name:{$in:params.name}});}
});

Meteor.publish('courses', function() {
  return Courses.find();
});

Meteor.publish('cups', function() {
  return Cups.find();
});
Meteor.publish('wagers', function(params) {
  if (params.name == 'all'){Wagers.find({});}
  else {return Wagers.find({name:params.name});}
});

Meteor.publish('history', function(params) {
    if (params.year > 0){
        var mID = 100*(params.year-2000);
        return History.find({matchID:{$gt:mID,$lt:mID+100},event:params.event});
    } else {
        return History.find({matchID:{$regex:params.year},event:params.event});
    }
});

Meteor.publish('rosters', function(eventstr) {
  return Rosters.find({event:eventstr});
});

Meteor.publish('matches', function(params) {
  if (params.name !== 'all') {return Matches.find({$or:[{T1:params.name},{T2:params.name}]})}
  else {
    if (params.year){
        if (!isNaN(params.year)){
            var idxmatch = 100*(parseInt(params.year)-2000);
            return Matches.find({event:params.event,matchID:{$gt:idxmatch,$lt:idxmatch+100}});
        }
            else {
                return Matches.find({event:params.event,matchID:{$regex:params.year}});
            }
    } else {
      return Matches.find({event:params.event});
    }
      
  }
  
  
  
});
//Meteor.publish('media', function(eventstr,year) {
//  var idxmatch = 100*(parseInt(year)-2000);
//  return Media.find({event:eventstr,'data.matchID':{$gt:idxmatch,$lt:idxmatch+100}})
//});

Meteor.publish('media', function(){
    return Media.find();
});

Meteor.publish('events', function() {
  return Events.find();
});

Meteor.publish('latestActivity', function () {
  return Activities.latest();
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('users', function() {
return Meteor.users.find();
});

Meteor.publish('exhibitions', function() {
return Exhibitions.find();
});


Email.send({
  to: "jtsutt@email.com",
  from: "thecupchampionship@gmail.com",
  subject: "Example Email",
  text: "The contents of our email in plain text.",
});

    Meteor.methods({
      sendVerificationLink() {
    let userId = Meteor.userId();
    if ( userId ) {
      return Accounts.sendVerificationEmail( userId );
    }
  }
    });
//db.members.aggregate({ $group: { _id: "$name", totaltenure: { $sum: "$tenure" } } },{ $match: { totaltenure: { $gte: 4 } } })


// autopublish the user's bookmarks and admin status
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {
    fields: {
      admin: 1,
      'services.twitter.profile_image_url_https': 1,
      'services.twitter.screenName':1
    }
  });
})