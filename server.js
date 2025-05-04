import express from 'express';
import Airtable from 'airtable';
import 'dotenv/config';

const app = express()
const port = process.env.PORT


const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', (req, res) => {
  res.render('index', {
    errorMessage: null,
    success: false
  });

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


app.post('/signup', (req, res) => {
  console.log(req.body);
  const { email, firstname, lastname, dob, school } = req.body;

  base('Signups').create({
    "Email": email,
    "First name": firstname,
    "Last name": lastname,
    "Date of Birth": dob,
    "School": school

  }, function(err, record) {
    if (err) {
      console.error(err);
      return res.render('index', {
        errorMessage: "something went wrong. please try again or email keepsake@hackclub.com if the error persists!",
        success: false
      })
      // return res.status(500).send('Error saving to Airtable');
    }
  console.log(record.getId());

  return res.render('index', {
    errorMessage: null,
    success: true
  })
  // res.sendFile(path.join(__dirname, '/signup_successful.html'));

});

  // base('Signups').create({
  //   Email: email,
  //   F: name
  // }, (err, record) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send('Error saving to Airtable');
  //   }
  //   res.send('Signup successful!');
  // });
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
