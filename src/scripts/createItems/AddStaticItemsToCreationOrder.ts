import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();
    console.log()
    const order = await handCashMinter.createCollectionItemsOrder(collectionId);
    console.log(order.id);
      await handCashMinter.addOrderItems({
        orderId: order.id,
        items: collectionDefinition.items.map((item: any) => {
          item.item.quantity = item.quantity;
          return item.item;
        }),
        itemCreationOrderType: 'collectionItem'
      });
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


