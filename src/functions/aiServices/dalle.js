const { app } = require("@azure/functions");
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

dotenv.config();

// Adapt to your personal values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_KEY"];
const apiVersion = "2024-04-01-preview";
const deployment = "dall-e-3";
const size = "1024x1024";
const n = 1;
const endpointTextTranslate = "https://api.cognitive.microsofttranslator.com";
const apiKeyTranslate = process.env["AZURE_TRANSLATE_KEY"];
const location = "swedencentral";

app.http("dalle", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      let prompt = request.params.message;
      const config = JSON.parse(request.params.config);

      //Translate prompt to english:
      let fromLanguage = "en";
      const detectedLanguage = await axios({
        baseURL: endpointTextTranslate,
        url: "/detect",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKeyTranslate,
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
            text: prompt,
          },
        ],
        responseType: "json",
      });
      if (detectedLanguage.data[0].isTranslationSupported) {
        fromLanguage = detectedLanguage.data[0].language;
      } else {
        throw new Error();
      }
      if (fromLanguage !== "en") {
        const translationResult = await axios({
          baseURL: endpointTextTranslate,
          url: "/translate",
          method: "post",
          headers: {
            "Ocp-Apim-Subscription-Key": apiKeyTranslate,
            "Ocp-Apim-Subscription-Region": location,
            "Content-type": "application/json",
            "X-ClientTraceId": uuidv4().toString(),
          },
          params: {
            "api-version": "3.0",
            from: fromLanguage,
            to: "en",
          },
          data: [
            {
              text: prompt,
            },
          ],
          responseType: "json",
        });
        prompt = translationResult.data[0].translations[0].text;
      }
      //------------------------

      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment,
      });
      const result = await client.images.generate({
        prompt,
        model: "",
        n,
        size: config.size,
        quality: config.quality,
        style: config.style,
      });
      return { body: JSON.stringify(result) };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
