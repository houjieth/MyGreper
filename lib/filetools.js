// We'd rather sacrifice user experience than confusing the user about the file content status
// So we don't use async read and write

// read file list, generate metadata and link information, then wrap it into json object
// However, this function is not being used by frontend but by backend
// ...weird
exports.readFileListJson= function() {
  fs = require('fs');
  var list = fs.readdirSync(process.env.IPREVIEW_SOURCE_HOME);
  console.log(list);

  var jsonObj = {
    files: []
  };

  for(var i=0; i<list.length; i++) {
    var file = list[i];
    var link = file;
    if(link.indexOf(".txt") != -1) {
      link = link.replace(".txt", ".html");
    } else {
      link = link + ".html";
    }
    link = "http://jiehou.net/ipreview/" + link;

    jsonObj.files.push({
      "name": file,
      "link": link
    });
  }

  return jsonObj;
};

// used to generate file list in index page
exports.readFileList = function() {
  fs = require('fs');
  var list = fs.readdirSync(process.env.IPREVIEW_SOURCE_HOME);
  console.log(list);

  var ret = new Array(); 

  for(var i=0; i<list.length; i++) {
    var file = list[i];
    var link = file;
    if(link.indexOf(".txt") != -1) {
      link = link.replace(".txt", ".html");
      link = "http://jiehou.net/ipreview/" + link;
      ret.push({
        "name": file,
        "link": link
      });
    }
  }

  console.log(ret);

  return ret;
};

exports.grepFilesJson = function(query, contextOption, caseOption, callback) {
  // prepare command line
  //console.log(query);
  if(caseOption === undefined)
      caseOption = '';
  else
      caseOption = '-i';
  var cmdStr = 'grep ' + '-n ' + contextOption + ' ' + caseOption + ' ' + query;
  cmdStr = cmdStr + " \"" + process.env.IPREVIEW_SOURCE_HOME + "\"*.txt";

  console.log(cmdStr);

  // prepare context and case flag
  var contextual = false;
  if(contextOption.indexOf('-C') != -1 ||
     contextOption.indexOf('-A') != -1 ||
     contextOption.indexOf('-B') != -1 ||
     contextOption.indexOf('-c') != -1 ||
     contextOption.indexOf('-A') != -1 ||
     contextOption.indexOf('-b') != -1)
      contextual = true;
  var ignoreCase = false;
  if(caseOption == '-i')
      ignoreCase = true;

  // execute grep in async, as the native nature of Node.js (event driven)
  var cp = require("child_process");
  cp.exec(cmdStr, function (err, stdout, stderr) {
    jsonObj = _generateGrepResponse(stdout, query, contextual, ignoreCase);
    callback(jsonObj);
  });
}

function _generateGrepResponse(input, query, contextual, ignoreCase) {
  //console.log(contextual);
  //console.log(ignoreCase);
  //console.log(input);
  if(contextual == false)
    input = adjustInput(input);
  //console.log(input);

  var jsonObj = {
    results: []
  };

  var entries = input.split('--\n');
  //console.log(entries);

  re = /.*\/(.*txt):(\d+):(.*)/;
  query = query.replace("*", ".*"); 
  //console.log(query);
  if(ignoreCase)
    qre = new RegExp(query, "i"); // re for query
  else
    qre = new RegExp(query); // re for query

  for(var i=0; i<entries.length; i++) {
    var entry = entries[i];
    //console.log(entry);
    //console.log("END");
    var lines = entry.split('\n');
    var locator, link, snippet = "";
    for(var j=0; j<lines.length; j++) {
      var line = lines[j];
      //console.log(line);
      //console.log("END");
      var match = re.exec(line);
      if(match != null) {
        locator = match[1] + ":" + match[2];
        link = "http://jiehou.net/ipreview/" + match[1].substring(0, match[1].length-4) +
            ".html#line-" + match[2];
        //snippet = snippet + locator + " --\t" + match[3] + '\n';
        var qmatch = qre.exec(match[3]);
        if(qmatch != null) {
          for(var k=0; k<qmatch.length; k++) {
              match[3] = match[3].replace(qmatch[k], '<code class="keyword">' + qmatch[k] + '</code>');
          }
        }
        snippet = snippet + match[3] + '\n';
      }

      //console.log(line);
    }
    //console.log(locator);
    //console.log(link);
    //console.log(snippet);
    //console.log("END");
    jsonObj.results.push({
      "locator": locator,
      "link": link,
      "snippet": snippet
    });
  }
  return jsonObj;
}

function adjustInput(input) {
  var lines = input.split('\n');
  var result = "";
  for(var i=0; i<lines.length-2; i++) {
      result = result + lines[i] + "\n--\n";
  }
  result = result + lines[i];
  return result;
}
     

