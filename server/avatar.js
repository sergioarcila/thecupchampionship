//var createThumb = function(fileObj, readStream, writeStream) {
//  // Transform the image into a 10x10px thumbnail
//  gm(readStream, fileObj.name()).resize(48).stream('PNG').pipe(writeStream);
//};

//var dataStorage = new FS.Store.Dropbox("imageData", {
//    key: "wofh7990qbwvsgm",
//    secret: "ratxbtkl7mo52vu",
//    token: "b7hyIIu3eycAAAAAAAB4dK3_9A-jgX5FiC8MhrQuVXYJdx3mMsbi01tIsY8JmNmo", // Don’t share your access token with anyone.
//    folder: "raw"    
//});

//var dataStorage = new FS.Store.CollectionFS('media');

//Media = new FS.Collection("imageData", {
//    stores: [dataStorage]
//    });

//Media.deny({
// insert: function(){
// return false;
// },
// update: function(){
 //return false;
 //},
 //remove: function(){
 //return false;
 //},
 //download: function(){
 //return false;
 //}
 //});
