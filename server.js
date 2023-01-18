// Complete Events Exercise
const { EventEmitter } = require("events");
const path = require("path");
const http = require("http");
const fs = require("fs");

const NewsLetter = new EventEmitter();

const server = http.createServer((req, res) => {
    const chunks = [];

    req.on("data", (chunk) => {
        chunks.push(chunk);
    });

    req.on("end", () => {
        if (req.url == "/newsletter_signup" && req.method == "GET") {
            res.writeHead(200, { "content-type": "text/html" });
            fs.readFile("signup_form.html", (err, contents) => {
                if (err) {
                    console.error(err);
                } else {
                    res.write(contents);
                    res.end();
                }
            })
        }
        else if (req.url == "/newsletter_signup" && req.method == "POST") {
            try {
                let reqBody = JSON.parse(Buffer.concat(chunks).toString());
                NewsLetter.emit("signup", reqBody);
                res.writeHead(200, { "content-type": "application/json" });
                res.write(JSON.stringify({ msg: "Successfully signed up!" }));
                res.end();
            } catch (error) {
                console.log("Cannot parse the response body to JSON.");
                res.writeHead(400, { "content-type": "text/html" });
                res.write("There was an error with your request.");
                res.end();
            }
        } else {
            res.writeHead(404, { "content-type": "text/html" });
            res.write("The page you are looking for cannot be found.");
            res.end();
        }
    })

}).listen(3000, () => {
    console.log("Listening on port 3000...");
});

NewsLetter.on("signup", (contact) => {
    fs.appendFile("contact-info.csv", `${contact.name}: ${contact.email}\n`, (err) => {
        if (err) {
            console.error(err);
        }
        console.log("Added new contact to contact-info.csv");
    })
})

