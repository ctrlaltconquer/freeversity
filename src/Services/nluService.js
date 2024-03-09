const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_NLU_API }),
  version: '2018-04-05',
  serviceUrl: process.env.IBM_SERVICE_URL
});

async function analyzeSentiment(text) {
  try {
    const response = await nlu.analyze({
      html: text,
      features: {
        "sentiment": {}
      }
    });
    return response.result.sentiment.document.label;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
}

async function handleNluPost(req, res) {
  const sentencenlu = req.body.sentencenlu;
  try {
    const labelnlu = await analyzeSentiment(sentencenlu);
    res.render("NLU/nlu", { labelnlu });
  } catch (error) {
    console.error('Error processing sentiment analysis:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { analyzeSentiment, handleNluPost };
