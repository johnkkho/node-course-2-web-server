const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
// Make a new express app
var app = express();

// Register partials
hbs.registerPartials(__dirname + '/views/partials');
// Tell express what view engin we are going to use
app.set('view engine', 'hbs');

// To register middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url} ${req.ip}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to appen to server.log.');
    }
  });
  next();
});

// Setup a middleware to stop all processes for the application.
// The server will run this line from start and stop on this line.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// Middleware, app.use takes the middleware function we want to use
// the variable __dirname, this variable that get pass into a file by the wapper function.
// dirname stores the path to your project directory
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// Run javascript code inside the template
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

//Setup handler for http get request
// app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
//   res.send({
//     name: 'John',
//     likes: [
//       'Basketball',
//       'IT'
//     ]
//   });
// });

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    content: 'Welcome to my home page',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
