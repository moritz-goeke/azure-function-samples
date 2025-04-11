# Azure Function Samples

This repository contains a collection of Azure Functions demonstrating various use cases, including AI services, Cosmos DB operations, and integrations with Azure Cognitive Services. The project is built using Node.js and leverages the Azure Functions framework.

## Project Structure

The repository is organized as follows:

```
azure-function-samples/
├── .vscode/                # VS Code settings and launch configurations
├── src/                    # Source code for Azure Functions
│   ├── functions/          # Azure Function scripts
│   │   ├── aiServices/     # AI service-related functions
│   │   │   ├── openai.js
│   │   │   ├── translate.js
│   │   │   ├── documentIntelligence.js
│   │   │   └── dalle.js
│   │   ├── cosmosDb/       # Cosmos DB operation functions
│   │   │   ├── createItem.js
│   │   │   ├── readItems.js
│   │   │   ├── updateItem.js
│   │   │   ├── deleteItem.js
│   │   │   └── userData.js
├── host.json               # Azure Functions runtime configuration
├── package.json            # Project dependencies and scripts
├── .funcignore             # Files and folders to exclude from deployment
└── README.md               # Project documentation
```

---

## Folder Descriptions

### `src/functions/aiServices`

This folder contains Azure Functions that integrate with various AI services provided by Azure. Each function is designed to demonstrate a specific AI capability, such as text generation, translation, document analysis, or image generation. These functions leverage Azure OpenAI, Translator, and Document Intelligence services to provide advanced AI-powered features.

### `src/functions/cosmosDB`

This folder includes Azure Functions that perform CRUD operations on Azure Cosmos DB. These functions are tailored to manage data efficiently, ensuring secure and scalable interactions with the database. They demonstrate how to handle user-specific data, implement access control, and perform operations like creating, reading, updating, and deleting items in a Cosmos DB container.

---

## Functions Overview

### AI Services

These functions integrate with Azure OpenAI, Translator, and Document Intelligence services to provide AI-powered capabilities.

#### 1. **`openai.js`**

- **Endpoint:** `/api/openai`
- **Description:** Handles chat completions using Azure OpenAI's GPT models.
- **Key Features:**
  - Accepts a conversation history and a user message.
  - Generates a response using the specified GPT model.
- **Dependencies:** `openai`, `dotenv`

#### 2. **`translate.js`**

- **Endpoint:** `/api/translate`
- **Description:** Translates text between languages using Azure Translator.
- **Key Features:**
  - Detects the source language if not provided.
  - Translates text to the target language.
- **Dependencies:** `axios`, `uuid`

#### 3. **`documentIntelligence.js`**

- **Endpoint:** `/api/documentIntelligence`
- **Description:** Analyzes documents using Azure Document Intelligence.
- **Key Features:**
  - Processes base64-encoded files.
  - Extracts structured data from documents like invoices.
- **Dependencies:** `@azure-rest/ai-document-intelligence`

#### 4. **`dalle.js`**

- **Endpoint:** `/api/dalle`
- **Description:** Generates images using Azure OpenAI's DALL-E model.
- **Key Features:**
  - Translates prompts to English if needed.
  - Generates images based on the provided prompt and configuration.
- **Dependencies:** `openai`, `axios`, `uuid`

---

### Cosmos DB Operations

These functions perform CRUD operations on Azure Cosmos DB.

#### 1. **`createItem.js`**

- **Endpoint:** `/api/createItem`
- **Description:** Creates a new item in a specified Cosmos DB container.
- **Key Features:**
  - Assigns a unique ID and timestamp to the item.
  - Associates the item with the authenticated user.

#### 2. **`readItems.js`**

- **Endpoint:** `/api/readItems`
- **Description:** Reads items from a specified Cosmos DB container.
- **Key Features:**
  - Filters items by the authenticated user's ID.
  - Orders results by creation date.

#### 3. **`updateItem.js`**

- **Endpoint:** `/api/updateItem`
- **Description:** Updates an existing item in a Cosmos DB container.
- **Key Features:**
  - Ensures the authenticated user owns the item before updating.
  - Merges new data with the existing item.

#### 4. **`deleteItem.js`**

- **Endpoint:** `/api/deleteItem`
- **Description:** Deletes an item from a Cosmos DB container.
- **Key Features:**
  - Ensures the authenticated user owns the item before deletion.

#### 5. **`userData.js`**

- **Endpoint:** `/api/userData`
- **Description:** Manages personal user data in Cosmos DB.
- **Key Features:**
  - Supports both read-only and update operations.
  - Creates or replaces user data based on the request.

---

## Configuration

### Environment Variables

The following environment variables must be set in a `.env` file for the functions to work:

- **AI Services:**

  - `AZURE_OPENAI_ENDPOINT`
  - `AZURE_OPENAI_KEY`
  - `AZURE_TRANSLATE_KEY`
  - `DOCUMENT_INTELLIGENCE_KEY`
  - `DOCUMENT_INTELLIGENCE_ENDPOINT`

- **Cosmos DB:**
  - `COSMOS_DB_ENDPOINT`
  - `COSMOS_DB_KEY`

### Azure Functions Settings

- **`host.json`:** Configures the Azure Functions runtime.
- **`.funcignore`:** Specifies files to exclude from deployment.

---

## Development

### Prerequisites

- Node.js (v16 or later)
- Azure Functions Core Tools
- Azure CLI (optional, for deployment)

### Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

````

2. Start the Azure Functions runtime:

   ```bash
   func start
   ```

3. Test the functions using tools like Postman or curl.

---

### Deployment

1. Prune unnecessary dependencies:

   ```bash
   npm prune --production
   ```

2. Deploy to Azure:
   ```bash
   func azure functionapp publish <FunctionAppName>
   ```

### Dependencies

The project uses the following key dependencies:

#### Azure SDKs:

- `@azure/functions`
- `@azure-rest/ai-document-intelligence`
- `@azure/cosmos`

#### Other Libraries:

- `openai`
- `axios`
- `dotenv`
- `uuid`

This is only to get a start with the most basic functions! Feel free to adapt and improve.

Happy coding!

````
