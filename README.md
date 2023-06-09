# HandCash Ordinals Minter

## Getting started

### Install dependencies

```bash
npm install
```

### Set up project variables

Paste your credentials in the `src/Settings.ts` file:
```ts
export const config = {
    appId: 'YOUR_APP_ID',
    appSecret: 'YOUR_APP_SECRET',
    authToken: 'YOUR_AUTH_TOKEN',
}

```

## Create a collection

### 1. Create a mint collection order

```bash
npm run createMintCollectionOrder
```

### 2. Process the inscription in batches

```bash
npm run inscribeItems <order_id>
```

## Create collection items

### 1. Create a mint items order

```bash
npm run createMintCollectionItemsOrder <collection_id>
```

### 2. Add the collection items to the order

```bash
npm run addCollectionItems <order_id>
```

### 3. Process the inscription in batches

```bash
npm run inscribeItems <order_id>
```
