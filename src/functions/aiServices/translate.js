const { app } = require("@azure/functions");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

// Adapt to your personal values
const endpointTextTranslate = "https://api.cognitive.microsofttranslator.com";
const endpointDocumentTranslate =
  "https://ai-horizon-translator.cognitiveservices.azure.com";
const apiKey = process.env.AZURE_TRANSLATE_KEY;
const location = "swedencentral";

app.http("translate", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const requestMessage = request.params.message;
      let fromLanguage = request.params.fromLanguage;
      const toLanguage = request.params.toLanguage;

      const ret = {};

      if (fromLanguage === "-") {
        const detectedLanguage = await axios({
          baseURL: endpointTextTranslate,
          url: "/detect",
          method: "post",
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            // location required if you're using a multi-service or regional (not global) resource.
            "Ocp-Apim-Subscription-Region": location,
            "Content-type": "application/json",
            "X-ClientTraceId": uuidv4().toString(),
          },
          params: {
            "api-version": "3.0",
          },
          data: [
            {
              text: requestMessage,
            },
          ],
          responseType: "json",
        });
        ret.languageDetection = detectedLanguage.data;
        if (detectedLanguage.data[0].isTranslationSupported) {
          fromLanguage = detectedLanguage.data[0].language;
        } else {
          fromLanguage = "en";
        }
      }

      const translationResult = await axios({
        baseURL: endpointTextTranslate,
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        params: {
          "api-version": "3.0",
          from: fromLanguage,
          to: toLanguage,
        },
        data: [
          {
            text: requestMessage,
          },
        ],
        responseType: "json",
      });

      ret.translationResult = translationResult.data;
      return { body: JSON.stringify(ret) };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
