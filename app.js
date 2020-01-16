const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
require('dotenv').config();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(helmet.hsts());
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use(helmet.noSniff());

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req, res){
    res.render("index");
});

app.post('/send', function(req, res){
    const output=`<p>You have a new contact request.</p>
            <h3>Contact Details</h3>
            <ul>
                <li>Name: ${req.body.text}</li>
                <li>Email: ${req.body.email}</li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>
    
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        //port: 465,
        //secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_FROMEMAIL, // generated ethereal user
            pass: process.env.NODEMAILER_PASS // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    // send mail with defined transport object
    transporter.sendMail({
        from: process.env.NODEMAILER_FROMEMAIL,
        to: process.env.NODEMAILER_TOEMAIL,
        subject: "Personal Website Message",
        text: "Message",
        html: output
    }, function(err){
        if(err){
            console.log("Encountered an Error!", err);
        }else{
            console.log("EMAIL SENT!");
        }
    });
    //console.log("Message sent: %s", info.messageId);
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.redirect("/#contact")
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("The server has started on port 3000.");
});