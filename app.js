var koa = require('koa');

var app = koa();
var serve = require('koa-static-folder');
app.use(serve('./public'));
var compile = require('./lib/compile');
var views = require('co-views');
var parse = require('co-body');
var fs = require('fs');
var render = views(__dirname + '/views', {
      ext: 'jade'
    });

app.use(function *(next){
  if (this.request.method !== 'GET' ) return yield next;
  
  var lesson = require('./views' + this.path + '.json');
  if (!lesson) return yield next;
  
  this.body = yield render('lesson', {
    "name": lesson.name,
    "code": lesson.code,
    "help": lesson.help,
    "result": lesson.result,
    "next" : lesson.nextLesson
  });
   
});

app.use(function *(next){
  if (this.request.path !== '/compile') return yield next;
  if (this.request.method === 'POST') {
    var body = yield parse(this);
    
    
    yield new Promise((resolve, reject) => {
      compile(body.code, (err, result) => {
        if (!err) {
          
          this.body = {
            result: result
          };
          resolve();
        } else {
          this.body = {
            error: err
          };
        }
        
      });
    });
  }
});




app.listen(process.env.PORT);