# Get inventory
This section showcases how to get items from a given HandCash account.

## Authentication
In this example, `HANDCASH_AUTH_TOKEN` can be either:

- The business wallet auth token you can get from the [developer dashboard](https://dashboard.handcash.io).

  <img width="1148" alt="image" src="https://github.com/HandCash/handcash-ordinals-minter/assets/25082216/50b65ddc-b66e-4a35-9d19-b54a21e8de19">
  
- Any user auth token that has been connected to your application. Find out more in the Connect SDK docs: https://docs.handcash.io/docs/user-authentication-overview

## Example

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

## Filters
You can use the following parameters to filter particular items from the inventory:

- **from**: An integer specifying the starting index for items to fetch. Default is 0.
- **to**: An integer specifying the ending index for items to fetch. Default is 20. Must be greater than 'from' and less than 'from + 501'.
- **collectionId**: A unique identifier for the collection to fetch items from.
- **searchString**: A string to search within item names, descriptions, etc.
- **fetchAttributes**: A boolean to decide whether to fetch attributes of items. Default is true.
- **attributes**: A filter to specify certain item attributes.
- **appId**: The application ID, used to filter items associated with a specific app.

## Sorters
You can use the following parameters to sort the results:

- **sort**: A string specifying the field to sort by. Possible values are ["name"]
- **order**: A string specifying the sorting order, either 'asc' (ascending) or 'desc' (descending). This filter is required if 'sort' is used.
