const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseName = "YourDatabaseName"; // Replace with your actual database name

app.http("updateItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const item = JSON.parse(request.params.item);
      const containerName = request.params.container;
      const itemId = request.params.itemId;

      const client = new CosmosClient({ endpoint, key });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      const { resource } = await container.item(itemId, itemId).read();

      //---------------------------------------
      // This part is to get and store the userId from the request header.
      // It works only if you have authentication integrated in your app.
      // If you don't have authentication, you can remove this part.
      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const user = JSON.parse(decoded);
      if (!user.userId || resource.owner !== user.userId)
        return { status: 401 };
      //---------------------------------------

      const newResource = { ...resource, ...item };

      await container.item(itemId, itemId).replace(newResource);
      return { status: 200 };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
