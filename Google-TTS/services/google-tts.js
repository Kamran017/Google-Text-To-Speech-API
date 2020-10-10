// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const path = require("path");

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
module.exports.convert = async function (id=1,inputText) {
  // Construct the request
  const request = {
    input: {text: inputText},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'tr-TR', name: 'tr-TR-Wavenet-A'	, ssmlGender: 'NEUTRAL'},
    
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'LINEAR16'},//for wav encoding
  };

  // Performs the text-to-speech request
  const responseArr = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file

  const writeFile = util.promisify(fs.writeFile);
  //for(var i=0; i<responseArr.length;i++){
    var outputPath = path.join(__dirname , "..","audio" );//audio output directory
    await writeFile( outputPath +"/"+ id+".wav" , responseArr.audioContent, 'binary');//write file to the directory
    console.log('Audio content written to file: ' + outputPath);//print the path
  //}
}