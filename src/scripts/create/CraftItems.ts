import {ComponentsFactory} from "../../ComponentsFactory.js";
const handCashMinter = ComponentsFactory.getHandCashMinter();
const handcashAccount = ComponentsFactory.getHandCashAccount();

async function main() {
    const collectionId = '65a1588698616d38dff41853';
    let items = await handcashAccount.items.getItemsInventory({ searchString: 'Rafa', collectionId });
    items = items.filter((item: any) => item.groupingValue === '0df774cab8b1c51d6d74fccd577fe436');
    const itemsToBurn = items.slice(0, 2);

    console.log(itemsToBurn.map((item: any) => item.origin));

    const loadedItemData = await ComponentsFactory.getItemsLoader().loadItems();
    const itemToCreate = loadedItemData.find((item) => item.name === 'Alex');
    itemToCreate.quantity = 1;


    // Burn 2 Rafa to Craft 1 Alex
    let burnOrderResult = await handCashMinter.burnAndCreateItemsOrder({
      burn: {
        origins: itemsToBurn.map((item: any) => item.origin),
      },
      issue: {
        items: [itemToCreate],
        collectionId: collectionId,
      }
    });

    console.log(`Items Burnt:`, itemsToBurn.map((item: any) => item.origin));

    if (burnOrderResult.itemCreationOrder) {
      console.log(`run npm run GetOrderStatus ${burnOrderResult.itemCreationOrder.id}`, 'to check the status of the order');
    }
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


