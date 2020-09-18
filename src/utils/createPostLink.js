
function CreateLink(req, Id, sPart, sObject, userName) {
    return new Promise(function(resolve) {
      var htmldata;
      var templateFile = path.resolve(__dirname, "../../postIndex.html")
      fs.readFile(templateFile, function(err, html) {
        if (err) {
            throw err; }
        htmldata = html.toString()
        htmldata = htmldata.replace(/datatitle/g, (req ? req : sObject.SessionDescription) + ', as posted on #Fyndario by ' + userName)
        htmldata = htmldata.replace(/datathumbLink/g, sPart.VideoSnapUrl !== "" ? sPart.VideoSnapUrl : "https://aws.in")
        htmldata = htmldata.replace(/datapDescription/g, sPart.Description + ', as posted on #Fyndario by ' + userName)
        htmldata = htmldata.replace(/datavideoLink/g, sPart.awsUrl)
        htmldata = htmldata.replace(/sessionId/g, Id)
        var saveTo = path.join(__dirname, "../../public/" + Id + ".html")
        fs.openSync(saveTo, 'w');
        fs.writeFile(saveTo, htmldata, function(err, results) {
            if (err != null) { console.error(err); }
        });
        var videoUrl = "http://" + config.hostAddress + "/" + Id + ".html" ;
        resolve(videoUrl)
      });
    });
  }


module.exports = {
    CreateLink: CreateLink,
}
