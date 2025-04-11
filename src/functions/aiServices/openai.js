const { app } = require("@azure/functions");
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// Adapt to your personal values
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const apiVersion = "2024-10-01-preview";

app.http("openai", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const requestMessage = request.params.message;
      const requestConversation = JSON.parse(request.params.conversation);
      const requestConfig = JSON.parse(request.params.config);
      const deployment = request?.params?.model || "gpt-4o";

      let messageArray = requestConversation
        .map((x) => ({
          role: x.from === "gpt" ? "assistant" : "user",
          content: x.message,
        }))
        .reverse();
      messageArray.push({ role: "user", content: requestMessage });

      let completionObject = {
        messages: messageArray,
        max_tokens: 4096,
        temperature: parseFloat(requestConfig?.temperature) || 0.7,
        top_p: parseFloat(requestConfig?.top_p || 0.95),
        frequency_penalty: parseFloat(requestConfig?.frequency_penalty) || 0,
        presence_penalty: parseFloat(requestConfig?.presence_penalty) || 0,
        stop: null,
      };

      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment,
      });
      const result = await client.chat.completions.create(completionObject);

      return { body: JSON.stringify(result) };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
