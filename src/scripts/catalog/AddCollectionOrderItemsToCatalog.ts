import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import pLimit from "p-limit";

const handCashService = ComponentsFactory.getHandCashService();
const handcashAccount = ComponentsFactory.getHandCashAccount();

async function main() {
    const [catlogId, createItemsOrderId] = new Command()
         .addArgument(new Argument('<catalogId>', 'the id of the item catalog'))
        .addArgument(new Argument('<createItemsOrderId>', 'The id of the completed create items order'))
        .parse(process.argv)
        .args;


    const itemCreationOrder = await handCashService.getCreateItemsOrder(createItemsOrderId);
    let collectionItemsInInventory = await handcashAccount.items.getItemsInventory({
        collectionId: itemCreationOrder.referencedCollection,
        from: 0,
        to: 20000,
    })
    let numberOfItemsAdded = 0;
    while (collectionItemsInInventory.length > 0) {
        const chunks = [];
        while (collectionItemsInInventory.length > 0) {
            numberOfItemsAdded += 250;
            chunks.push(collectionItemsInInventory.splice(0, 250));
        }
        const limit = pLimit(20);
        await Promise.allSettled(chunks.map(chunk => limit(async () => {
            await handCashService.addItemsCatalog({
                itemOrigins: chunk.map((item: any) => item.origin),
                itemCatalogId: catlogId
            });
        })));
        collectionItemsInInventory = collectionItemsInInventory = await handcashAccount.items.getItemsInventory({
            collectionId: itemCreationOrder.referencedCollection,
            from: 0,
            to: 20000,
        })
    }
    console.log(numberOfItemsAdded, 'Items Added to Catalog');
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
