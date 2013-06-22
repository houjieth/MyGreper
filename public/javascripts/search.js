$(document).ready(function() {
  $('#submitButton').click(startGrep);
  $('#queryBox').bind('keydown', 'return', startGrep);
  $('#contextButton').bind('keydown', 'return', startGrep);
  return false;
});

function startGrep() {
  $.ajax({
    type: 'POST',
    url: '/grep/',
    data: $('.searchBox').serialize(),
    success: function(data) {
      renderResult(data);
    }
  });
  return false; 
}

function renderResult(data) {
  var results = data.results;
  $('.searchResult').html("");
  for(var i=0; i<results.length; i++) {
    $('.searchResult').append('<a class="locator">' + results[i].locator + '</a>');
    $('.searchResult').append('<pre class="snippet" url="' + results[i].link + '">' + results[i].snippet + '</pre>');
    $('.searchResult').append('</div>');
    //console.log(results[i].locator);
  }
  $('.snippet').mouseenter(function() {
    $(this).css("background-color", "#BDDEFF");
  }).mouseleave(function() {
    $(this).css("background-color", "#F3F3F7");
  }).click(function() {
    window.open($(this).attr("url"));
  });
}
