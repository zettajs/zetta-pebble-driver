
var PebbleDriver = module.exports = function(pebble) {
  this.pebble = pebble;
  this.state = 'online';
  this.type = 'smartwatch';
  this.name = 'Matts Pebble';
  this.data = {
    Pebble: 'EAE8'
  };

  var self = this;
  this.pebble.on('application_message', function(size, data){
    var tid = data[1];
    self.pebble.ack(tid, function(){});
    var flag = data.readInt32LE(26);

    if(flag === 1) {
      self.call('select-button');
    } else if (flag === 2) {
      self.call('top-button');
    }
  });
};

PebbleDriver.prototype.init = function(config) {
  config
    .when('online', { allow: [ 'sms', 'email' ] })
    .map('sms', this.sendSms, [{ name: 'sender', type: 'text'}, { name: 'body', type: 'text'}])
    .map('email', this.sendEmail, [{ name: 'sender', type: 'text'}, { name:'subject', type: 'text'}, { name: 'body', type: 'text' }])
    .map('top-button', this.topButton)
    .map('select-button', this.selectButton);
};

PebbleDriver.prototype.sendSms = function(sender, body, cb) {
  this.pebble.sms(sender, body, function(err) {
    if(err) {
      console.log('Error writing to pebble!');
    } else {
      cb();
    }
  });

};

PebbleDriver.prototype.sendEmail = function(sender, subject, body, cb) {
  this.pebble.email(sender, subject, body, function(err) {
    if(err) {
      console.log('Error writing to pebble');
    } else {
      cb();
    }
  });
};

PebbleDriver.prototype.topButton = function(cb) {
  return cb();
};

PebbleDriver.prototype.selectButton = function(cb) {
  return cb();
};