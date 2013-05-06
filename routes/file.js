exports.listFile = function(req, res) {
  var filetools = require('../lib/filetools');
  var list = filetools.readFileListJson();
  res.json(list);
};

exports.grepFiles = function(req, res) {
  var filetools = require('../lib/filetools');
  filetools.grepFilesJson(
          req.body.query,
          req.body.contextOption,
          req.body.caseOption,
          function(jsonObj) {
            res.json(jsonObj);
          });
};
