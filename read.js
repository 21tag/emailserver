// This example script opens an IMAP connection to the server and
// seeks unread messages sent by the user himself. It will then
// download those messages, parse them, and write their attachments
// to disk.
 
// Install node-imap with `npm install imap`
var imap = require("imap");
var inspect = require('util').inspect;
// Install mailparser with `npm install mailparser`
var mailparser = require("mailparser").MailParser;
 
// You need a config file with your email settings
var fs = require("fs");
var config = require("./config.js");
 
var server = new imap({
    user: config.username,
    password: config.password,
    host: config.imap.host,
    port: config.imap.port,
    tls: config.smtp.tls,
    tlsOptions: { rejectUnauthorized: false }
});

var exitOnErr = function(err){
    console.error(err);
    process.exit();
};

function openInbox(cb) {
  server.openBox('INBOX', true, cb);
}

server.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = server.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      server.end();
    });
  });
});

server.once('error', function(err) {
  console.log(err);
});

server.once('end', function() {
  console.log('Connection ended');
});

server.connect();

