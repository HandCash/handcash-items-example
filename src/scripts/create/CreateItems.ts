import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();
const handcashService = ComponentsFactory.getHandCashService();

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const itemsToCreate = await ComponentsFactory.getItemsLoader().loadItems();
    let creationOrder = await handCashMinter.createItemsOrder({ collectionId, items: itemsToCreate});
    console.log(`Items Creation Order Id:`, creationOrder.id)
    console.log(`Check order status with npm run GetOrderStatus ${creationOrder.id}`)
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


