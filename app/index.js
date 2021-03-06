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
const ua = require('universal-analytics');
const cookieParser = require('cookie-parser');

logger.token('fwd', function(req) {
  return (req.get('x-forwarded-for') || '').replace(/\s/g, '');
});

function createApp() {
  console.log('[ENV]', env.NODE_ENV);

  const app = express();

  const iconLibs = {
    clarity: require('./icons/clarity'),
    devicon: require('./icons/devicon'),
    entypo: require('./icons/entypo'),
    feather: require('./icons/feather'),
    fontawesome: require('./icons/font-awesome'),
    jam: require('./icons/jam'),
    material: require('./icons/material'),
    octicons: require('./icons/octicons'),
    simple: require('./icons/simple')
  };

  let total = 0;
  let iconCounts = {};

  Object.keys(iconLibs).forEach(lib => (iconCounts[lib] = 0));

  setTimeout(function() {
    Object.keys(iconLibs).forEach(lib => {
      iconCounts[lib] = iconLibs[lib].count();
      total += iconLibs[lib].count();
    });

    console.log('Total Icons: ', total);

    app.locals.iconCounts = iconCounts;
    app.locals.total = total;
  }, 0);

  if (isDev) {
    app.locals.pretty = true;
  }

  app.disable('x-powered-by');
  app.enable('trust proxy');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.locals.modules = path.join(__dirname, '..', 'node_modules');

  app.use(cookieParser());

  app.use((req, res, n) => {
    app.locals.ENV = env.NODE_ENV;
    app.locals.host = `${isDev ? req.protocol : 'https'}://${req.get('host')}`;
    app.locals.originalUrl = `${app.locals.host}${req.path}`;
    app.locals.GA_ID = GA_ID;
    req.ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress;
    n();
  });

  app.use(
    logger(
      global.production
        ? ':method ":url" :status referrer=":referrer" cf_ray=:req[cf-ray] fwd=:fwd bytes=:res[content-length] :response-time ms request_id=:req[x-request-id] agent=":user-agent"'
        : 'dev'
    )
  );

  if (global.production)
    app.use(ua.middleware(GA_ID, { cookieName: '_ga', debug: isDev }));

  app.get('/health', function(request, reply) {
    reply.send('ok');
  });

  app.get('/', function(request, reply) {
    reply.render('home', {
      title: 'Home',
      content: ``
    });
  });

  Object.keys(iconLibs).forEach(lib => app.use(`/${lib}`, iconLibs[lib]));

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
