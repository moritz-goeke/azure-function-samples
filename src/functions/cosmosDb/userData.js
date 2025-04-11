const { app } = require("@azure/functions");
const { v4: uuidv4 } = require("uuid");
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseName = "YourDatabaseName"; // Replace with your actual database name

// Function to store personal user data, will only work if you have authentication integrated in your app

app.http("userData", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const containerName = "UserData";
      const userData = JSON.parse(request.params.newUserData);
      const readOnly = request?.params?.readOnly;

      const client = new CosmosClient({ endpoint, key });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const user = JSON.parse(decoded);

      if (!user.userId) return { status: 401 };
      const partitionKey = user.userId;

      const querySpec = {
        query: `SELECT * FROM  ${containerName} c WHERE c.owner = @partitionKey`,
        parameters: [{ name: "@partitionKey", value: partitionKey }],
      };

      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      if (readOnly) {
        return { status: 200, body: JSON.stringify(items) };
      }

      if (items.length > 0) {
        // Item exists: Replace it
        const existingItem = items[0]; // Get the first (and only) item

        const newResource = {
          ...existingItem,
          ...userData,
          owner: user.userId,
          id: existingItem.id,
        };

        const { resource: updatedItem } = await container
          .item(existingItem.id, partitionKey)
          .replace(newResource);

        return {
          status: 200,
          body: {
            message: "Item replaced successfully.",
            item: updatedItem,
          },
        };
      }

      // Item does not exist: Create it
      userData.id = uuidv4();
      userData.owner = user.userId;
      userData.createdAt = Date.now();

      const { resource: createdItem } = await container.items.create(userData);
      return {
        status: 201,
        body: {
          message: "Item created successfully.",
          item: createdItem,
        },
      };
    } catch (e) {
      return { status: 500, body: "Error!" };
    }
  },
});
