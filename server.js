import express from 'express';
import Airtable from 'airtable';

// const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


app.post('/signup', (req, res) => {
  const { email, name } = req.body;

  base('Signups').create({
    Email: email,
    Name: name
  }, (err, record) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving to Airtable');
    }
    res.send('Signup successful!');
  });
})
// import express from 'express';
// // import dotenv from 'dotenv';
// // import Airtable from 'airtable';
// //
// // dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;
//
// // parse form data
// app.use(express.urlencoded({ extended: true }));
//
// // Serve static files from 'public' folder
// app.use(express.static('public'));
//
// // Airtable setup
// // const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
//
// // route to handle form POST
// app.post('/signup', (req, res) => {
//   const { email, name } = req.body;
//
//   base('Signups').create({
//     Email: email,
//     Name: name
//   }, (err, record) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Error saving to Airtable');
//     }
//     res.send('Signup successful!');
//   });
// });
//
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
