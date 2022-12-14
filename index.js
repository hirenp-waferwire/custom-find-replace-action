const core = require('@actions/core');
const github = require('@actions/github');
const glob = require("glob");
const fs = require('fs');


var modifiedCount = 0;
var getDirectories = function (src, callback) {
  glob(src, callback);
};


function findAndReplace(path, FindReplaceParse) {
  var data = fs.readFileSync(path, 'utf8');
  let newContents = data.slice();
  for (let index = 0; index < FindReplaceParse.length; index++) {
    const item = FindReplaceParse[index];
    newContents = newContents.replace(new RegExp(`${item.find}`, 'gi'), item.replace);
  }
  if (data != newContents) {
    fs.writeFileSync(path, newContents);
    ++modifiedCount
  }
}

try {

  const globPath = core.getInput('GlobPath');
  const FindReplace = core.getInput('FindReplace');
  const FindReplaceParse = JSON.parse(FindReplace);;

  getDirectories(globPath, function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(res);
      if (res.length > 0) {
        for (let index = 0; index < res.length; index++) {
          const path = res[index]
          var stats = fs.statSync(path);
          if (stats.isFile()) {
            findAndReplace(path, FindReplaceParse);
          }
        }
        core.setOutput("modifiedFiles", modifiedCount);
      } else {
        core.setOutput("modifiedFiles", modifiedCount);
      }
    }
  });

} catch (error) {
  core.setFailed(error.message);
}