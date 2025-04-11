const { app } = require("@azure/functions");
const DocumentIntelligence =
    require("@azure-rest/ai-document-intelligence").default,
  {
    getLongRunningPoller,
    isUnexpected,
  } = require("@azure-rest/ai-document-intelligence");

// Adapt to your personal values
const key = process.env.DOCUMENT_INTELLIGENCE_KEY;
const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT;

const sampleInvoiceUrl =
  "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

app.http("documentIntelligence", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const fileInBase64 = request.params.fileInBase64;
      const selectedFileType =
        request?.params?.selectedFileType || "prebuilt-invoice";
      const base64_data = fileInBase64.split(",")[1];

      const client = DocumentIntelligence(endpoint, { key: key });
      const initialResponse = await client
        .path("/documentModels/{modelId}:analyze", selectedFileType)
        .post({
          contentType: "application/json",
          body: {
            base64Source: base64_data,
          },
        });

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }

      const poller = getLongRunningPoller(client, initialResponse);
      const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

      const documents = analyzeResult?.documents;
      const result = documents && documents[0];

      if (!result) {
        throw new Error("Expected at least one document in the result.");
      }
      return { status: 200, body: JSON.stringify(result) };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
