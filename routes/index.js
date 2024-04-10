var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Handle the Form 
router.post('/booking', async function (req, res) {

  var response = {
      headers: req.headers,
      body: req.body
  };

  res.json(response);    
});
*/
/* Handle the Form */
router.post('/booking', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.noOfTicket);
    req.body.terms = req.body.terms? true : false;
    req.body.created_at = new Date();
    req.body.modified_at = new Date();

    let result = await db.collection("bookings").insertOne(req.body);
    res.status(201).json({ id: result.insertedId, record: req.body});
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


/* Display all Bookings */
router.get('/booking', async function (req, res) {
  const db = await connectToDB();
  try {
      let results = await db.collection("bookings").find().toArray();
      res.render('bookings', { bookings: results });
  } catch (err) {
      res.status(400).json({ message: err.message });
  } finally {
      await db.client.close();
  }
});

// Search Bookings
router.get('/booking/search', async function (req, res) {
  const db = await connectToDB();
  try {
    let query = {};
    if (req.query.email) {
      query.email = {$regex: req.query.email};
    }
    if (req.query.numTickets) {
      query.numTickets = parseInt(req.query.numTickets);
    }

    let result = await db.collection("bookings").find(query).toArray();
    res.render('bookings', { bookings: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Pagination based on query parameters page and limit, also returns total number of documents
router.get('/booking/paginate', async function (req, res) {
  const db = await connectToDB();
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let skip = (page - 1) * perPage;

    let result = await db.collection("bookings").find().skip(skip).limit(perPage).toArray();
    let total = await db.collection("bookings").countDocuments();

    res.render('paginate', { bookings: result, total: total, page: page, perPage: perPage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  finally {
    await db.client.close();
  }
});


module.exports = router;


