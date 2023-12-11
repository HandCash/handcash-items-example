# HandCash Items Example Project

## Getting started
This project demo's examples of how to create and manage items for your Handcash Application.  You may want to take different pieces and scripts of this repo and add them directly into your game logic.


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

```


## Define your collection
Create a json file of each Item you would like to create, the data can be in any structure.

Here is an example defining 3 items, quantity denontes how many of each item we want to be created.


 [Example](/assets/handcash_test/info.json)
```json
[
   {
      "edition": "Test",
      "generation": 1,
      "image": "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/zq0lupxoj8id1uedgz2h.png",
      "quantity": 3, 
      "rarity": "Mythic",
      "name": "Rafa",
      "country": "Spain"
    },
    {
      "edition": "Test",
      "generation": 1,
      "image": "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/gh7tsn11svhx7z943znv.png",
      "quantity": 3,
      "rarity": "Mythic",
      "name": "Alex",
      "country": "Andorra"
    },
    {
      "edition": "Test",
      "generation": 2,
      "image": "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/edaoeseq43yqdbqwjzn4.png",
      "name": "Brandon Bryant",
      "quantity": 1,
      "rarity": "Mythic",
      "country": "United States"
    }
]

```



### Mapping data to Handcash API Specs with a Custom Component Loader
Because data can be in many different forms, you must create a custom component loader to map your data to the [expected structure](src/loaders/Types.ts) the only required fields for each item are name and image.
You can find more about this configuration file at https://docs.handcash.io/docs/collection-metadata


#### Some tips
- Cache image is an optional higher res image that does not go on chain but is set as the Items image internally. No limit for size of `cacheImage`.



You can find an example of a custom component loader [here](src/loaders/HandCashItemsLoader.ts)

The custom component loader will map data into the structure below

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
          "url": "https://res.cloudinary.com/handcash-iae/image/upload/v1687295380/items/HeroImage_MysteryBox_wq5iz2_lceykv.jpg",
          "imageHighResUrl": "https://res.cloudinary.com/handcash-iae/image/upload/v1687295380/items/HeroImage_MysteryBox_wq5iz2_lceykv.jpg",
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

### 2. Create a collection

Creates a Collection as defined in your items loader. You will want to save your collection id and use it to add collectionItems to it later.
```bash
npm run CreateCollection
```

### 3. Create items inside the collection

There are two methods of creating items, creating methods in a single api call and creating items in batches 


#### 3A. Dynamically creating smaller sets of items.

Creating Items in a single API call, use this method if you are creating less than 100 items at once.  The size limit for each image that goes on chain using this method is 50kb, it is recommended to also provide a higher resolution image with `item.mediaDetails.image.imageHighResUrl` so that the nicer higher resolution is displayed in the Handcash wallet and market.

This method of item creation is best used when dynamically creating smaller sets of items. 

This is also simplest method for creating items and is free of charge to create items. 
```bash
npm run CreateItems <collection_id>
```

#### 3B. Creating larger static collection items in batches 
This method of creating items is best utilized when creating a large batch of items for a single collection for example thousands of items at once.  The size limit for images using this method is 1.5 MB but it is still recommended to inscribe a smaller image and to utilize  `item.mediaDetails.image.imageHighResUrl` property to cache a higher resolution image.

This script makes use of many api calls to 
- Create item creation order
- Add items to order 
- Commit order 
- Pay for order 
- iteratively create items in batches 


```bash
npm run InscribeCollectionInBatch <collection_id>
```

## Transfer an item
Once items are created, the Handcash sdk can be used to transfer an item by the owner of the item

```bash
npm run transferSingleItem <origin> <destination>
```

## Debug

### Get inscription order info by order ID
```bash
npm run getInscriptionOrder <order_id>
```

## Util Methods 

## Send All Order Items to Handle
```bash
npm run sendAllOrderItems <orderId> <handle> 
```

