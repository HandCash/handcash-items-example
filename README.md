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
HANDCASH_APP_SECRET=<your-app-secret>
HANDCASH_AUTH_TOKEN=<your-business-wallet-auth-token>

# IAE values
HANDCASH_BASE_API_ENDPOINT=https://iae.cloud.handcash.io
CLOUDINARY_API_KEY=882244126343337
CLOUDINARY_CLOUD_NAME=handcash-iae

# Prod values
HANDCASH_BASE_API_ENDPOINT=https://cloud.handcash.io
CLOUDINARY_API_KEY=544588249773336
CLOUDINARY_CLOUD_NAME=hn8pdtayf

```


## Define your collection
Create a json file of each Item you would like to create, the data can be in any structure.

 [Example](/assets/handcash_test/info.json)
```json
[
    {
      "edition": "Test",
      "generation": 1,
      "image": "rafa.png",
      "quantity": 3, 
      "rarity": "Mythic",
      "name": "Rafa",
      "country": "Spain"
    },
    {
      "edition": "Test",
      "generation": 1,
      "image": "alex.png",
      "quantity": 3,
      "rarity": "Mythic",
      "name": "Alex",
      "country": "Andorra"
    },
    {
      "edition": "Test",
      "generation": 2,
      "image": "bb.png",
      "name": "Brandon Bryant",
      "quantity": 1,
      "rarity": "Mythic",
      "country": "United States"
    }
]

```



### Create Custom Component Loader 
Because data can in many different forms, you must create a custom component loader to map your data to the [expected structure](src/loaders/Types.ts) the only required fields for each item are name and image.
You can find more about this configuration file at https://docs.handcash.io/docs/collection-metadata


#### Some tips
- Add all images including `image` and `cacheImage` referenced in your info.json to the images directory. 1 MB is the maximum size for the `image`.
- Cache image is an optional higher res image that does not go on chain but is set as the Items image internally. No limit for size of `cacheImage`.



You can find an example of a custom component loader [here](src/loaders/HandCashItemsLoader.ts)

```json
{
  "collection": {
    "name": "Example collection",
    "description": "A collection with example items",
    "mediaDetails": {
      "image": {
        "url": "https://res.cloudinary.com/handcash-iae/image/upload/v1687295380/items/HeroImage_MysteryBox_wq5iz2_lceykv.jpg",
        "contentType": "image/png"
      }
    }
  },
  "items": [
    {
      "name": "An example item",
      "rarity": "Common",
      "color": "#B19334",
      "quantity": 5,
      "mediaDetails": {
        "image": {
          "url": "./assets/dummy/images/3.png",
          "contentType": "image/png"
        }
      },
      "attributes": [
        {
          "name": "Edition",
          "value": "First",
          "displayType": "string"
        }
      ]
    }
  ]
}

```



### 1. Configure Component Loader 

in the [ComponentsFactory](/src/ComponentsFactory.ts) ensure your custom Components loader is set in the `getItemsLoader`
for example the item loader below will create 10 example NFTs of the handcash team

```
 static getItemsLoader(): AbstractItemsLoader {
        // 10 NFT example
        return new HandCashItemsLoader({
             folderPath: './assets/handcash_test',
        });
    }

```

### 2. Create an inscribe a collection

```bash
npm run inscribeCollection
```

### 2. Create an inscribe collection item

```bash
npm run InscribeStaticCollectionItems <collection_id>
```

## Add items to an existing collection
update `info.json` and in the [ComponentsFactory](/src/ComponentsFactory.ts) ensure your custom Components loader is set in the `getItemsLoader`

```bash
npm run InscribeStaticCollectionItems <collection_id>
```

## Airdrop a collection

```bash
npm run airdropItems <create_items_order_id>
```

## Create a catalog of packs

```bash
npm run createCatalog <create_items_order_id>
```

## Transfer an item

```bash
npm run transferSingleItem <origin> <destination>
```

## Debug

### Get inscription order info by order ID
```bash
npm run getInscriptionOrder <order_id>
```

## Util Methods 

## Upload image
```bash
npm run uploadImage <pathToFile>
```
## Send All Order Items to Handle
```bash
npm run sendAllOrderItems <orderId> <handle> 
```

