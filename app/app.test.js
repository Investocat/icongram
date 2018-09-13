const request = require('supertest');
const test = require('tape');
const app = require('./')();

test('GET /health', t => {
  request(app)
    .get('/health')
    .expect(200)
    .expect(res => t.equal(res.text, 'ok', '/health is ok'))
    .end(t.end);
});

test('GET /', t => {
  request(app)
    .get('/')
    .expect(200)
    .end(t.end);
});

test('GET /jam', t => {
  request(app)
    .get('/jam')
    .expect(200)
    .expect(
      res => t.ok(res.text.indexOf('</html>') > 0),
      'iconlist page is fine'
    )
    .end(t.end);
});

test('GET /clarity/close.svg', t => {
  request(app)
    .get('/clarity/close.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /devicon/chrome-original.svg', t => {
  request(app)
    .get('/devicon/chrome-original.svg?size=256')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /entypo/bell.svg', t => {
  request(app)
    .get('/entypo/bell.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /feather/camera.svg', t => {
  request(app)
    .get('/feather/camera.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /fontawesome/apple.svg', t => {
  request(app)
    .get('/fontawesome/apple.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /jam/cog.svg', t => {
  request(app)
    .get('/jam/cog.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /material/account.svg', t => {
  request(app)
    .get('/material/account.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /octicons/alert.svg', t => {
  request(app)
    .get('/octicons/alert.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});

test('GET /simple/500px.svg', t => {
  request(app)
    .get('/simple/500px.svg?size=256&color=ff00ff')
    .expect(200)
    .expect('Content-Type', 'image/svg+xml; charset=utf-8')
    .expect(
      res => t.ok(res.body.toString().indexOf('ff00ff') > 0),
      'contains color hex'
    )
    .expect(
      res => t.ok(res.body.toString().indexOf('</svg>') > 0),
      'svg looks okay'
    )
    .end(t.end);
});