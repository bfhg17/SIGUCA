/**
* Dependencias del módulo
*/

var express = require('express');

module.exports = function (app, config, passport) {

  app.set('showStackError', true);

  //Compress needs to be called high in the stack
  app.use(express.compress ({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(express.favicon(config.root + '/public/images/favicon.ico'));
  app.use(express.static(config.root + '/public'));

  app.use(express.logger('dev'));

  app.set('views', config.root + '/views');
  app.set('view engine', 'jade');

  app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    //multipart not needed, so instead of body parser, we use json() and urlencoded() only for better security
    app.use(express.json());
    app.use(express.bodyParser());
    //app.use(express.urlencoded());
    app.use(express.cookieParser('your secret here'));
    app.use(express.methodOverride());
    app.use(express.session());
    //Use Passport Session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    app.configure('development', function () {
      app.locals.pretty = true;
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
        app.use(express.errorHandler());
    });
  });
};