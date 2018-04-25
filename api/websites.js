import db from '../models/index';
const { Website } = db;
import config from '../app-config';

function load(app) {
  app.post('/api/websites', (req, res) => {
    if (config.authenticate && !req.isAuthenticated()) {
      return res.status(401).end();
    }

    const { name, selector, url } = req.body;

    if (!name || !selector || !url) {
      return res.status(400).json({ msg: 'name, URL and selector cannot be blank' });
    }

    Website.create(req.body)
      .then(data => {
        let { status = 200 } = data;
        res.status(status).json(data);
      })
      .catch(e => {
        console.error('error message', e);
        res.status(500).json({ msg: e.name || e });
      });
  });

  app.get('/api/websites', (req, res) => {
    if (config.authenticate && !req.isAuthenticated()) {
      return res.status(401).end();
    }

    Website.findAll()
      .then(websites => {
        res.json({ websites });
      })
      .catch(e => {
        res.status(500).json({ msg: e.name || e });
      });
  });

  app.get('/api/websites/:id', (req, res) => {
    if (config.authenticate && !req.isAuthenticated()) {
      res.status(401).end();
    }

    const { id } = req.params;
    let website;

    Website.findAll({ where: { id } })
      .then(_website => {
        website = _website;
        if (!website) {
          throw 'Website not found';
        }
        res.json({ website });
      })
      .catch(e => {
        res.status(500).json({ msg: e.msg || e.name || e, website });
      });
  });

  app.patch('/api/websites/:id', (req, res) => {
    if (config.authenticate && !req.isAuthenticated()) {
      res.status(401).end();
    }
    let {
      body: { name, url, selector }
    } = req;
    const { id } = req.params;

    Website.findById(id)
      .then(website => {
        return website.update({ name, url, selector });
      })
      .then(({ dataValues }) => {
        return res.json({ website: dataValues });
      })
      .catch(e => {
        console.log('whoops an error');
        console.error('scrape error', typeof e);
        res.status(500).json({ msg: e.msg || e.name || e });
      });
  });

  app.delete('/api/websites/:id', (req, res) => {
    const { id } = req.params;

    if (config.authenticate && !req.isAuthenticated()) {
      res.status(401).end();
    }

    Website.findById(id)
      .then(website => website.destroy())
      .then(() => {
        res.end();
      })
      .catch(e => {
        console.error('error in catch', e);
        res.status(400).json({ msg: e.name || e });
      });
  });

  app.get('/api/websites/:id/events', (req, res) => {
    if (config.authenticate && !req.isAuthenticated()) {
      res.status(401).end();
    }
    const { id } = req.params;
    let website;

    Website.findById(id)
      .then(_website => {
        website = _website;
        if (!website) {
          return res.status(400).json({ msg: 'Website not found' });
        }
        return website.getEvents();
      })
      .then(events => {
        res.json({ events, websiteId: website.id });
      })
      .catch(e => {
        res.status(500).json({ msg: e.name || e });
      });
  });
}

export default {
  load
};
