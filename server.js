'use strict';

const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const dbUrl = 'mongodb://freecodecamp:free@ds115625.mlab.com:15625/freecodecamp';

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/save', upload.array(), (req, res, next) => {
    const params = JSON.parse(req.body.json);

  mongo.connect(dbUrl).then((db) => {
    const collection = db.collection('dreams');

    collection.insert(params);  
    
    collection.find().toArray((err, result) => {
      if (err) {
        throw err;
      }

      res.json(result);

      db.close();
    });
  }).catch(function (err) {throw err;});
});

app.get('/dreams', (req, res) => {
  
    mongo.connect(dbUrl, (err, db) => {
      // db gives access to the database
      if (err) {
        throw err;
      }

      const collection = db.collection('dreams');

      collection.find().toArray((err, result) => {
        if (err) {
          throw err;
        }

        res.json(result);

        db.close();
      });
    });
});

// Respond not found to all the wrong routes
app.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});