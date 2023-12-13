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

## Create a collection

```javascript
import dotenv from 'dotenv';
import { HandCashMinter, Environments, Types, HandCashConnect } from '@handcash/handcash-connect';

dotenv.config();

const handCashMinter = HandCashMinter.fromAppCredentials({
  appId: process.env.HANDCASH_APP_ID,
  authToken: process.env.HANDCASH_AUTH_TOKEN,
});

(async () => {
  const creationOrderResult = await handCashMinter.createCollection({
      name: 'HandCash Team Caricatures',
      description: 'A unique collection of caricatures of the HandCash team',
      mediaDetails: {
        image: {
          url: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685141160/round-handcash-logo_cj47fp_xnteyo_oy3nbd.png',
          contentType: 'image/png'
        }
      }
    });

  const items = await handCashMinter.getOrderItems(creationOrder.id);
  console.log(`Collection Created, collectionId: ${items[0].id}`);
})();
```

### Expected Output

After running the script, you should see the following output in the console:

> Collection Created, collectionId: 6578857e01a833fb337aaa3b

Next, we will add some items to this new collection so keep the collection id. 


## Create Items
You will need to reference a collection to add the items to. You can use the collection id from the previous step.


```javascript
import dotenv from 'dotenv';
import { HandCashMinter } from '@handcash/handcash-connect';

dotenv.config();

const handCashMinter = HandCashMinter.fromAppCredentials({
  appId: process.env.HANDCASH_APP_ID,
  authToken: process.env.HANDCASH_AUTH_TOKEN,
});

(async () => {

  const collectionId = "657762fc2acbecc109d8c1fb";

  const creationOrder = await handCashMinter.createItems(
    collectionId,
    [
      {
        user: "612cba70e108780b4f6817ad",
        name: "Rafa",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "1", displayType: "string" },
          { name: "Country", value: "Spain", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398977/items/jyn2qqyqyepqhqi9p661.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/zq0lupxoj8id1uedgz2h.png",
            contentType: "image/webp"
          }
        },
        color: "#bf9078",
        quantity: 3
      },
      {
        user: "6213a44bf2936f711c8d19d3",
        name: "Alex",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "1", displayType: "string" },
          { name: "Country", value: "Andorra", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398906/items/da2qv0oqma0hs3gqevg7.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/gh7tsn11svhx7z943znv.png",
            contentType: "image/webp"
          }
        },
        color: "#73c9ac",
        quantity: 3
      },
      {
        name: "Brandon Bryant",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "2", displayType: "string" },
          { name: "Country", value: "United States", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398906/items/da2qv0oqma0hs3gqevg7.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/edaoeseq43yqdbqwjzn4.png",
            contentType: "image/webp"
          }
        },
        color: "#adeaf5",
        quantity: 1
      }
    ]);

  console.log(`Items order created, items are being created asynchronous`);
  const items = await handCashMinter.getOrderItems(creationOrder.id);
  console.log('Items created', items);
})();

```

In this example, 7 items in total are created:
- 3 "Rafa's" are created to the user with id `612cba70e108780b4f6817ad`
- 3 "Alex's" are created to the user with id `6213a44bf2936f711c8d19d3`
- 1 "Brandon Bryant" is created to the applications business wallet because no user was specified.  

## Get Inventory

In this example, `HANDCASH_AUTH_TOKEN` can be either:

- The business wallet auth token.
- Any user auth token that has been connected to your application.

### Example

```javascript
import dotenv from 'dotenv';
import { HandCashConnect} from "@handcash/handcash-connect";

dotenv.config();

const handcashAccount = new HandCashConnect({
    appId: process.env.HANDCASH_APP_ID
    appSecret: process.env.HANDCASH_APP_SECRET
}).getAccountFromAuthToken(process.env.HANDCASH_AUTH_TOKEN);

(async () => {
 const filters = {
        collectionId: "657762fc2acbecc109d8c1fb",
        searchString: "Brandon Bryant",
        from: 0,
        to: 50,
        fetchAttributes: false,
        sort: "createdAt",
        order: "asc"
    };
    const items = await handcashAccount.items.getItemsInventory(filters);
    console.log(items);
})(); 
```

For more details about fetching inventory check [this example](/examples/get-inventory.md).


## TransferItem

```javascript
import dotenv from 'dotenv';
import { HandCashConnect} from "@handcash/handcash-connect";

dotenv.config();

const handcashAccount = new HandCashConnect({
    appId: process.env.HANDCASH_APP_ID
    appId: process.env.HANDCASH_APP_SECRET
}).getAccountFromAuthToken(process.env.HANDCASH_AUTH_TOKEN);

(async () => {
 const filters = {
        collectionId: "657762fc2acbecc109d8c1fb",
        searchString: "Brandon Bryant",
        from: 0,
        to: 1,
    };
    const receiverUserId = "612cba70e108780b4f6817ad";
    const items = await handcashAccount.items.getItemsInventory(filters);
    const result = await account.items.transfer({
        destinationsWithOrigins: [
            {
              destination: receiverUserId,
              origins: [items[0].origin]
            }
        ]
    })
    console.log(`- ✅ Item transferred to ${destination}!`);
})(); 
```
