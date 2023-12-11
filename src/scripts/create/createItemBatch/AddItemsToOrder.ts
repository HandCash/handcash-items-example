import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Types} from "@handcash/handcash-connect";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();
async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const items = await ComponentsFactory.getItemsLoader().loadItems();
    await addItemsToCreationOrder(orderId, items);
    console.log('To Commit order: npm run CommitOrder', orderId);
}

export async function addItemsToCreationOrder(orderId: string, items: Types.CreateItemMetadata[]){
  let totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  await handCashMinter.addOrderItems({
      orderId,
      items: items,
      itemCreationOrderType: 'collectionItem'
    });
  console.log(totalQuantity, 'items added to order');
}
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


