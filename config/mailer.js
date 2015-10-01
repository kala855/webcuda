var  nodemailer = require('nodemailer');

var transporter, config;

module.exports = {

  config : function () {
    transporter = nodemailer.createTransport();
    try {
      config = require('./alertemail.json');
      console.log('successfully');
      transporter = nodemailer.createTransport(config);
    } catch (e) {
      console.log(e);
      console.log("SMTP client was configured as 'direct'. If you prefer to use an account please create json file at config/alertemail.json".yellow);
    }
  },

  sendMail : function (from, to, subject, html, callback) {
    // callback(err)
    if (!transporter) {
      console.log('Error : SMTP client has not been configured');
      return false;
    }
    transporter.sendMail({
      from : from,
      to   : to,
      subject : subject,
      html : html
    }, callback);
  }
}

