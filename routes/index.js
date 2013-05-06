
/*
 * GET home page.
 */

exports.index = function(req, res){
  var filetools = require('../lib/filetools');
  var fileList = filetools.readFileList();
  res.render('index', {
    fileList: fileList
  });
};
