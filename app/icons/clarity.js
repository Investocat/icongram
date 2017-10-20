const router = require('express').Router();
const utils = require('../utils');
const makeIcon = utils.makeIcon;
const ClarityIcons = require('clarity-icons/shapes/all-shapes');

const count = Object.keys(ClarityIcons.AllShapes).length;

let icons = {};

Object.keys(ClarityIcons.AllShapes).map(name => {
  const svgIcon = ClarityIcons.AllShapes[name];
  utils
    .xml2js(svgIcon)
    .then(iconJS => {
      if (
        iconJS.svg.$.class &&
        (iconJS.svg.$.class.indexOf('has-solid') > -1 ||
          iconJS.svg.$.class.indexOf('can-badge') > -1 ||
          iconJS.svg.$.class.indexOf('can-alert') > -1)
      ) {
        [
          'circle',
          'ellipse',
          'line',
          'polygon',
          'polyline',
          'rect',
          'path'
        ].forEach(type => {
          if (iconJS.svg[type]) {
            iconJS.svg[type].forEach(ele => {
              if (
                ele.$.class &&
                (ele.$.class.indexOf('clr-i-solid') > -1 ||
                  ele.$.class.indexOf('clr-i-badge') > -1 ||
                  ele.$.class.indexOf('clr-i-alert') > -1 ||
                  ele.$.class.indexOf('clr-i-outline--alerted') > -1 ||
                  ele.$.class.indexOf('clr-i-outline--badged') > -1)
              ) {
                ele.$.style = 'display:none';
              }
            });
          }
        });
      }
      icons[name] = utils.builder.buildObject(iconJS);
    })
    .catch(e => console.error('[ERROR] ClarityIcons parsing failed', name, e));
});

console.log('Loaded %d Clarity Icons', count);

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
  reply.json(
    Object.keys(icons).map(name => {
      return {
        name,
        icon: icons[name]
      };
    })
  );
});

router.get('/:icon.svg', function(req, reply, next) {
  const svgIcon = icons[req.params.icon];

  if (!svgIcon) return reply.status(404).send('Icon Not Found');

  makeIcon(svgIcon, req.query)
    .then(res => {
      const referer = req.headers.referer || '';
      if (referer.indexOf(req.get('host')) < 0 && global.production) {
        req.visitor.event(
          {
            ec: req.baseUrl.substr(1),
            ea: req.params.icon,
            el: referer,
            uip: req.ip,
            dr: referer
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
module.exports.count = () => count;
