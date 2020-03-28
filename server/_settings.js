// Provide defaults for Meteor.settings

S3.config = {
	key: 'AKIAJWJAXISNP47L4ABQ',
	secret: 'JphiaO2KUEKo4kkMwwOzNC5I8B6fycusdhQ3uh/j',
	bucket: 'cupmedia',
	region: 'us-east-2' // Only needed if not "us-east-1" or "us-standard"
};

//
// To configure your own Twitter keys, see:
//   https://github.com/meteor/meteor/wiki/Configuring-Twitter-in-Local-Market
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  //twitter: {
    //consumerKey: "PLfrg2bUh0oL0asi3R2fumRjm", 
    //secret: "sRI8rnwO3sx7xUAxNWTX0WEDWph3WEBHu6tTdJYQ5wVrJeVCCt"
  //}
  twitter: {
    consumerKey: "8GjhWQCy5QWjlUOsPN6bu0Exo", 
    secret: "48OjCXymqi2Q1Xe8mhIeYLyJ2qByTqn4DPGwjKwX1wroXhCiCt"
  } 
    
});


ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.consumerKey,
      secret: Meteor.settings.twitter.secret
    }
  }
);
