# HandCash Ordinals Minter

## Getting started

### Install dependencies

```bash
npm install
```

### Set up project variables

Paste your credentials in the `.env` file:
```
HANDCASH_APP_ID=<your-app-id>
HANDCASH_AUTH_TOKEN=<your-business-wallet-auth-token>
```

## Create a collection

### 1. Create an inscribe collection order

```bash
npm run createInscribeCollectionOrder
```

### 2. Process the inscription in batches

```bash
npm run inscribeItems <create_collection_order_id>
```

## Create collection items

### 1. Create an inscribe items order

```bash
npm run createInscribeCollectionItemsOrder <collection_id>
```

### 2. Add the collection items to the order

```bash
npm run addCollectionItems <create_items_order_id>
```

### 3. Process the inscription in batches

```bash
npm run inscribeItems <create_items_order_id>
```

## Aidrop a collection

```bash
npm run airdropItems <create_items_order_id>
```

## Create a catalog of packs

```bash
npm run createCatalog <create_items_order_id>
```

## Debug

### Get inscription order info by order ID
```bash
npm run getInscriptionOrder <order_id>
```
