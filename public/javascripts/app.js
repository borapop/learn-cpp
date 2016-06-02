var editor = ace.edit("editor");
//editor.setTheme("ace/theme/tomorrow_night");
var CMode = ace.require("ace/mode/c_cpp").Mode;
editor.session.setMode(new CMode());

var task = document.getElementById('task');
var output = document.getElementById('output');
var help = document.getElementById('help');
var done = document.getElementById('done');

var compile = function(){
  console.log('bump!');
  var code = editor.getValue();

  console.log(code);
  var output = document.getElementById('output');
  var xhr = new XMLHttpRequest();
  
  var json = JSON.stringify({
    code: code
  });
  
  xhr.open('POST', '/compile');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  
  xhr.onreadystatechange = function() { // (3)
    if (xhr.readyState != 4) return;
  
    
  
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        var res = JSON.parse(xhr.response);
        
        if (res.result !== 'undefined') {
          output.innerHTML = res.result;
          if (output.innerHTML == task.innerHTML) {
            output.style.color = 'green';
            help.innerHTML = done.innerHTML;
          } else {
            output.style.color = 'white';
          }
          
        }
        
        /*
        output.innerHTML += '<br>' + outputText ;
        output.scrollTop = output.scrollHeight;
        */
    }
  
  };
  
  xhr.send(json);
  

}