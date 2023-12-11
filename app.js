//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { dirname } = require("path");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // path of static files

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data = {
        members: [                          // body paramater: members array of objects(email, name, ...)
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {             // member merge var : FNAME, LNAME, BIRTHDAY, ...
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); // turn data into string of formate(JSON)
    const url = "https://us14.api.mailchimp.com/3.0/lists/3a92a37af2"; // authenticate with list id

    const options = {
        method: "POST", // option (method) allow us to specify the type of request ('GET', 'POST')
        auth: "testuser:c939c2a2d265cfcb1d7ddc18316254e2-us14"  // HTTP authentication - API KEY as the password
    }

    // post data into the external resource
    const request = https.request(url, options, function(response) {       
    
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            //console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);    // request: send the data to mailchimp
    request.end();              // done the request

})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

// dynamic port: work seamlessly with their system
app.listen(process.env.PORT || 3002, function() {  
    console.log("Server is running on port 3002.");
})

//api key
//c939c2a2d265cfcb1d7ddc18316254e2-us14

//list id
//3a92a37af2
