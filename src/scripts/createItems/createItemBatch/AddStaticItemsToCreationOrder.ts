import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();
async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();
    const order = await handCashMinter.createCollectionItemsOrder(collectionId);
    let totalQuantity = 0;
    await handCashMinter.addOrderItems({
        orderId: order.id,
        items: collectionDefinition.items.map((item: any) => {
          totalQuantity += item.quantity;
          item.item.quantity = item.quantity;
          return item.item;
        }),
        itemCreationOrderType: 'collectionItem'
      });
    console.log(totalQuantity, 'items added to order');
    console.log('To Commit order: npm run CommitItemCreationOrder', order.id);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


