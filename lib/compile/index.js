var fs = require('fs');
var spawn = require('child_process').spawn;
var errors = [];
spawn('rm', ['lol.c', 'lol.o']);
module.exports = function(code, callback) {
    
    var date = new Date();
    var filename = date.getTime();
    
    fs.writeFile(filename + ".cpp", code, 'utf-8', (err) => {
        if(err) {
            callback(err);
        }
        
        var compile = spawn('gcc', ['-lstdc++', filename + '.cpp', '-o', filename + '.o']);
        compile.stderr.on('data', (err) => {
            errors.push(String(err));
            spawn('rm', [filename + '.cpp', filename + '.o']);
        });
        
        compile.on('close', (data) =>{
            if (data === 1) {
                spawn('rm', [filename + '.cpp', filename + '.o']);
                var temp = errors
                errors = [];
                callback(null, temp);
               
            } else {
               
                var result;
                var run = spawn('./' + filename + '.o');
               
                run.stderr.on('data', (err) => {
                    spawn('rm', [filename + '.cpp', filename + '.o']);
                  
                })
               
                run.stdout.on('data', function(output){
                    console.log(output);
                    result = output.toString();
                    spawn('rm', [filename + '.cpp', filename + '.o']);
                });
                
                run.on('close', (exitCode) => {
                   if (exitCode === 0) {
                        spawn('rm', [filename + '.cpp', filename + '.o']);
                        callback(null, result);
                       
                   } else {
                        spawn('rm', [filename + '.cpp', filename + '.o']);
                        
                        callback(null, result);
                   }
               })
               
           }
           
        });
    });
};