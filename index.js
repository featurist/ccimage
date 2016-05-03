var uuid = require('node-uuid');
var fs = require('fs');
var http = require('httpism');

function cli(args) {
  if (args.length < 1 || args.length > 3) {
    console.log("usage: ccimage [dimensions] [keywords] [count]");
    console.log("  e.g: ccimage 320x200 party 5");
    return;
  }
  
  var dimensions = (args[0] || "320x240").split('x'),
      keywords = args[1] || "image",
      count = Number(args[2] || "1");
  
  for (var i = 0; i < count; ++i) {
    download(dimensions, keywords);
  }
}

function download(dimensions, keywords) {
  var encodedKeywords = encodeURIComponent(keywords);
  var imageUrl = 'http://loremflickr.com/' + dimensions[0] +
                                       '/' + dimensions[1] +
                                       '/' + encodedKeywords;
  http.get(imageUrl, {
    headers: { accept: 'image/*' },
    responseBody: 'stream'
  }).then(function(response) {    
    var filename = encodedKeywords + '.' + uuid.v4() + '.jpg';
    var file = fs.createWriteStream(filename);
    console.log(filename);
    response.body.pipe(file);
  }).catch(function(error) {
    console.error(error);
  });
}

module.exports = {
  cli: cli,
  download: download
}
