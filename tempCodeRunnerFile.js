const http = require("http");
const nodemailer = require("nodemailer");

const server = http.createServer((request, response) => {
  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "salimt450s@gmail.com",
      pass: "ldzz vnfo ayti mwlm",
    },
  });

  const receiver = {
    from: "salimt450s@gmail.com",
    to: "salimeg30@gmail.com",
    subject: "Node Js Mail Testing!",
    text: "Hello this is a text mail!",
  };

  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) throw error;
    console.log("success!");
    response.end();
  });
});

server.listen(8080);
