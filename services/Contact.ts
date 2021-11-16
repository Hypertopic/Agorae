const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
  public_key: process.env.MAILGUN_PUBLIC_KEY || "pubkey-yourkeyhere",
});


// init 
// TODO : Need to be updated 
export function sendMessage(message, name, email) {
  mg.messages
    .create("sandbox-123.mailgun.org", {
      from: "Excited User <mailgun@sandbox-123.mailgun.org>",
      to: ["test@example.com"],
      subject: "New message from " + name,
      text: message,
      html: message,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
}
