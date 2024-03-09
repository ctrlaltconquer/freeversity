<pre>
const express = require('express');
// const { NaturalLanguageUnderstandingV1 } = require('ibm-watson/natural-language-understanding/v1');
const { NaturalLanguageUnderstandingV1 } = require('ibm-watson/natural-language-understanding/v1');

const { IamAuthenticator } = require('ibm-watson/auth');

const app = express();

// Configure IBM NLU service
// const nlu = NaturalLanguageUnderstandingV1({
//     authenticator: new IamAuthenticator({ apikey: 'KYUjnPVY--6kaFSZRcA64ifNND5OvrlRUci4PYfYSJVM' }),
//     serviceUrl: 'https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/918e18ab-52d4-4b19-a561-8c024efaeb1b',
//     version: '2021-08-01',
// });


// Endpoint to analyze text using NLU
app.get('/', async (req, res) => {
    const { text } = req.query;

    try {
        const response = await nlu.analyze({
            text,
            features: {
                entities: {},
                keywords: {},
            },
        });
        res.json(response.result);
    } catch (error) {
        console.error('Error analyzing text:', error);
        res.status(500).json({ error: 'An error occurred while analyzing text' });
    }
});

// Start server

app.listen(3000, () => {
    console.log("SErver started");
});
</pre>
