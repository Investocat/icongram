const router = require('express').Router();
const makeIcon = require('../utils').makeIcon;
const ClarityIcons = require('clarity-icons/shapes/all-shapes');

let icons = ClarityIcons.AllShapes;

router.get('/', function(req, reply) {
  reply.locals.originalUrl = `${req.app.locals.host}${req.originalUrl}`;
  reply.locals.source = 'https://vmware.github.io/clarity/icons';
  reply.render('iconlist', {
    title: 'Clarity Icons',
    icons: Object.keys(icons).map(name => {
      return {
        name,
        icon: icons[name]
      };
    })
  });
});

router.get('/json', function(req, reply) {
  reply.json(Object.keys(icons).map(name => {
    return {
      name,
      icon: icons[name]
    };
  }));
});

router.get('/:icon.svg', function(req, reply, next) {
  const objIcon = icons[req.params.icon];

  const colored = typeof req.query.colored != 'undefined';

  if (!objIcon) return reply.status(404).send('Icon Not Found');

  req.query.color = colored ? objIcon.hex : req.query.color;

  makeIcon(objIcon.svg, req.query)
    .then(res => {
      const referer = req.headers.referer || '';
      if (referer.indexOf(req.get('host')) < 0) {
        req.visitor.event(
          {
            ec: req.baseUrl.substr(1),
            ea: req.params.icon,
            el: referer
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
