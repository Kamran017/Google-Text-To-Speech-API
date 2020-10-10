const express = require('express');
const app = express();
const server = require('http').Server(app);
// util libraries definitions
const path = require('path');
const fs = require('fs');

var xlsxj = require("xlsx-to-json");
const googletts = require("./services/google-tts");


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/', function (req, res) {
    res.send("Hello World From Google-TTS Test");
});

// manual convert
app.get('/convert', async function (req, res) {
    var convText = req.query.input;
    if (convText) {
        await googletts.convert(convText);
    } else {
        res.send("No Input Text Entered.")
    }
});

// automatic input handler
app.get('/fromxls',async function (req, res) {
    xlsxj({
        input: path.join(__dirname, 'services', 'test.xlsx'),//data set name 
        output: "./output.json"//ouput json file
    }, async function (err, result) {
        if (err) throw err;
        res.send(result);
        //push id and text with for loop and then pop data from google and write it to the file
        if (result){
            //var textArr=[]; //get string one by one from xls file
            for(var i=0;i<result.length;i++){
                await googletts.convert(i,result[i]['text']);
                setTimeout(function(){ 
                    console.log("");
                }, 2000);   
                //textArr.push(result[i]['text']);
            };
            //await googletts.convert(textArr);
            console.log("Results have been saved");
        };
    });
});


const port = process.env.port || 8000;
server.listen(port, function (err) {
    console.log("Server is listening on port:" + port + " ...");
});