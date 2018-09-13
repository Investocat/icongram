const router = require('express').Router();
const devicons = require('devicon-2.2/devicon.json');
const fs = require('fs');
const makeIcon = require('../utils').makeIcon;

let icons = [];
let count = 0;

devicons.forEach(icon => {
  count += icon.versions.svg.length;
  icon.versions.svg.forEach(type => {
    let ico = {}
    ico['name'] = `${icon.name}-${type}`
    ico['icon'] = fs.readFileSync(
      require.resolve(`devicon-2.2/icons/${icon.name}/${ico['name']}.svg`),
      'utf8'
    );
    icons.push(ico)
  })
})

console.log('Loaded %d Devicon', count);

router.get('/', function(req, reply) {
  reply.locals.source = 'http://konpa.github.io/devicon/';
  reply.render('iconlist', {
    title: 'Devicon',
    icons
  });
});

router.get('/json', function(req, reply) {
  reply.json(icons);
});

router.get('/:icon.svg', function(req, reply, next) {
  const objIcon = icons.find(i => i.name == req.params.icon)

  if (!objIcon) return reply.status(404).send('Icon Not Found');

  makeIcon(objIcon.icon, req.query)
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
