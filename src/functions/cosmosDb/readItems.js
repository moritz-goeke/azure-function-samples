const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseName = "YourDatabaseName"; // Replace with your actual database name

app.http("readItems", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const containerName = request.params.container;

      //---------------------------------------
      // This part is to get the userId from the request header.
      // It works only if you have authentication integrated in your app.
      // If you don't have authentication, you can remove this part.
      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const user = JSON.parse(decoded);
      if (!user.userId) return { status: 401 };
      //---------------------------------------

      const client = new CosmosClient({ endpoint, key });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      // If you dont have the user field integrated (see above), adapt the query
      const querySpec = {
        query: `SELECT * FROM ${containerName} c WHERE c.owner = @userId ORDER BY c.createdAt DESC`,
        parameters: [{ name: "@userId", value: user.userId }],
      };

      const { resources } = await container.items.query(querySpec).fetchAll();

      return { status: 200, body: JSON.stringify(resources) };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
