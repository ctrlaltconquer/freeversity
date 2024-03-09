const express = require('express');


const app = express();

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: 'k0DQwXxoPDUDANzRbQXUwHrgEhO95udXnohpnrDQ1FAa' }),
  version: '2018-04-05',
  serviceUrl: 'https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/7a198f76-2986-4419-982a-3affdfccfbf8'
});

nlu.analyze(
    {
      html: "I love eating apple", // Buffer or String
      features: {
        "sentiment": {},
      }
    })
    .then(response => {
      console.log(JSON.stringify(response.result, null, 2));
    })
    .catch(err => {
      console.log('error: ', err);
    });

console.log(nlu.analyze.sentiment)
// Endpoint to analyze text using NLU
// Start server

app.listen(3000, () => {
    console.log("SErver started");
});
