var filelistClosed = false;
var curFileName = null;
var cm = null;
var doc = null;

$(document).ready(function() {
        
  $('.fileLink').each(function(i, elem) {
    $(elem).click(function() {
      if(cm != null) {
        $('#main').children()[1].remove(); // remove the CodeMirror div
      }
      $('#editor').load(escape($(elem).attr('url')), 
        function(responseText, textStatus, XMLHttpRequest) {
          loadAndInitDoc(elem, 0);
        });
    });
  });

  $('#togglefilelist').click(function() {
    if(filelistClosed == false) {
      $('.viewer').animate({'left': '-2px'}, 500);
      $('#main').css("width", $(window).width());
      filelistClosed = true;
    } else {
      $('.viewer').animate({'left': '300px'}, 500);
      $('#main').css("width", $(window).width() - 300);
      if(cm != null)
          cm.refresh();
      filelistClosed = false;
    }
  });
});

function loadAndInitDoc(elem, initLineNum) {
  curFileName = $(elem).attr('filename');
  cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "text/x-csrc",
    keyMap: "vim",
    autofocus: true,
    showCursorWhenSelecting: true,
    lineWrapping: true
  });

  $('#main').css("width", $(window).width()-300);
  $('#main').css("height", $(window).height()-40);

  doc = cm.getDoc();
  doc.setCursor(initLineNum, 1);
  cm.scrollIntoView();
  //cm.setOption("theme", "ambiance");

  CodeMirror.commands.save = function(){
    var writeUrl = escape($(elem).attr('writeUrl'));
    var content = cm.getDoc().getValue();
    $.post(writeUrl, {fileContent : content});
    alert("Save to: " + writeUrl); 
  };
};
