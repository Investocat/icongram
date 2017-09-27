const router = require('express').Router();
const makeIcon = require('../utils').makeIcon;
const simpleIcons = require('simple-icons');

let icons = {};

Object.keys(simpleIcons).forEach(i => {
  const filename = i
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[ .\-!’]/g, '');
  icons[filename] = simpleIcons[i];
});

router.get('/', function(req, reply) {
  reply.locals.originalUrl = `${req.app.locals.host}${req.originalUrl}`;
  reply.locals.source = 'https://github.com/simple-icons/simple-icons';
  reply.render('iconlist', {
    title: 'Simple Icons',
    icons: Object.keys(icons).map(name => {
      return {
        name,
        icon: icons[name].svg
      };
    })
  });
});

router.get('/json', function(req, reply) {
  reply.json(
    Object.keys(icons).map(name => {
      return {
        name,
        icon: icons[name].svg
      };
    })
  );
});

router.get('/:icon.svg', function(req, reply, next) {
  const objIcon = icons[req.params.icon];

  const colored = typeof req.query.colored != 'undefined';

  if (!objIcon) return reply.status(404).send('Icon Not Found');

  req.query.color = colored ? objIcon.hex : req.query.color;

  makeIcon(objIcon.svg, req.query)
    .then(res => {
      const referer = req.headers.referer || '';
      if (referer.indexOf(req.get('host')) < 0 && global.production) {
        req.visitor.event(
          {
            ec: req.baseUrl.substr(1),
            ea: req.params.icon,
            el: referer,
            uip: req.ip
          },
          err => (err ? console.error(err) : null)
        );
      }
      reply.type('image/svg+xml').send(res);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
