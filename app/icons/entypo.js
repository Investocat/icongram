const router = require('express').Router();
const entypo = require('entypo');
const utils = require('../utils');
let icons = [];
let count = 0;

utils
  .xml2js(entypo())
  .then(objSvg => {
    icons = objSvg.svg.symbol.map(s => {
      const options = Object.assign(objSvg.svg.$, s.$, {
        width: 20,
        height: 20
      });
      delete s.$;
      delete objSvg.svg.$.style;
      return {
        name: options.id.split('entypo-')[1],
        icon: utils.builder.buildObject({
          svg: {
            g: s,
            $: options
          }
        })
      };
    });
  }).then(() => {
    count = icons.length;
    console.log('Loaded %d Entypo Icons', count);
  })
  .catch(e => console.log(e));

router.get('/', function(req, reply) {
  reply.locals.source = 'http://www.entypo.com/';
  reply.render('iconlist', { title: 'Entypo', icons });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  const ico = icons.find(i => i.name == req.params.icon);

  if (!ico) return reply.status(404).send('Icon Not Found');

  const rawIcon = ico.icon;

  utils
    .makeIcon(rawIcon, req.query)
    .then(res => {
      const referer = req.headers.referer || '';
      if (referer.indexOf(req.get('host')) < 0 && global.production) {
        console.info('[TRACK] host=%s, referer=%s', req.get('host'), referer);
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
module.exports.count = () => count;
