const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const africastalking = require('africastalking');
const socketio = require('socket.io');

// Init africastalking
const AfricasTalking = new africastalking({
  apiKey: '5f4b74919c450e82ef3f35c6392a1b5ed74804eebc2b03112b12b39fa59d6ff6',
  username: 'sandbox'
}, {debug: true});

// Init app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
  res.render('index');
});
// Catch form submit
app.post('/', (req, res) => {
  // res.send(req.body);
  // console.log(req.body);
  const to = req.body.number;
  const message = req.body.text;
  const sms = AfricasTalking.SMS;
     sms.send({to: `+254${to}`, message})
    .then((reply) => {console.log(reply)})
    .catch((error) => {console.log(error)});

});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => console.log(`We Love Nerds ${port}`));

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
})

