const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const socketio = require('socket.io');
const africastalking = require('africastalking');

// Init africastalking
const AfricasTalking = new africastalking({
  apiKey: 'xxxx',
  username: 'xxxx'
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
    .then(success => console.log({message: message, to: to}))
    .catch(error => console.log(error));
    // Get data from response
    const data = {
      message: message,
      number: to
    }

    // Emit to the client
    io.emit('smsStatus', data);

});

// Define port
const port = 8080;

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

