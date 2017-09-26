const env = process.env;
global.production = env.NODE_ENV == 'production';
const isDev = !global.production;
const GA_ID = 'UA-91125324-4';

if (global.production) {
  require('newrelic');
}

const express = require('express');
const logger = require('morgan');
const path = require('path');
const ua = require("universal-analytics");
const cookieParser = require('cookie-parser');

logger.token('fwd', function(req) {
  return (req.get('x-forwarded-for') || '').replace(/\s/g, '');
});

function createApp() {
  const app = express();

  app.locals.modules = path.join(__dirname, '..', 'node_modules');

  app.use(cookieParser())

  app.use((req, res, n) => {
    app.locals.host = `${req.protocol}://${req.get('host')}`;
    app.locals.originalUrl = `${app.locals.host}${req.path}`;
    app.locals.GA_ID = GA_ID;
    n();
  });

  console.log('[ENV]', env.NODE_ENV);
  if (isDev) {
    app.locals.pretty = true;
  }
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.disable('x-powered-by');
  app.enable('trust proxy');

  app.use(
    logger(
      global.production
      ? ':method ":url" :status referrer=":referrer" cf_ray=:req[cf-ray] fwd=:fwd bytes=:res[content-length] :response-time ms request_id=:req[x-request-id] agent=":user-agent"'
      : 'dev'
    )
  );

  app.use(ua.middleware(GA_ID, { cookieName: '_ga' }));

  app.get('/', function(request, reply) {
    reply.render('home', {
      title: 'Home',
      content: ``
    });
  });

  app.use('/clarity', require('./icons/clarity'));
  app.use('/entypo', require('./icons/entypo'));
  app.use('/feather', require('./icons/feather'));
  app.use('/fontawesome', require('./icons/font-awesome'));
  app.use('/material', require('./icons/material'));
  app.use('/octicons', require('./icons/octicons'));
  app.use('/simple', require('./icons/simple'));

  app.use(express.static('app/public'));

  app.use(function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;

    console.log(
      '[ERROR]',
      new Date().toISOString(),
      err.status == 404 ? err.message : err.stack,
      req.originalUrl
    );

    if (isDev) {
      return res.json({
        code: err.status || -1,
        error: true,
        message: isDev ? err.message : 'Something went wrong!',
        stack: err.stack
      });
    }

    res.status(404).send('Not Found');
  });

  return app;
}

module.exports = createApp;
