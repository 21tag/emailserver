// This script will send an image as an email attachment to the
// user himself. The receiving part of this is in read.coffee
 
// Install EmailJS with `npm install emailjs`

email = require("emailjs");
 
// You need a config file with your email settings
fs = require("fs");
config = require("./config.js");

var server  = email.server.connect({
    "user": config.username,
    "password": config.password,
    "host": config.smtp.host,
    "ssl": true
});
 
message = email.message.create({
    "text": "This is a test of the OpenRecess mail server.  What happens if there is just lots and lots of text? Way too much for a text message?",
    "from": "OpenRecess@gmail.com",
    "reply-to": "openrecess+something@gmail.com",
    "to": "andrew.magliozzi@gmail.com",
    "subject": "Testing Node.js email capabilities for OpenRecess"
});

server.send(message, function(err, message){
    if (err) return console.error(err);
    console.log("Message sent with id " + message['header']['message-id']);    
});