import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();

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
    let creationOrder = await handCashMinter.createItems(collectionId, itemsToCreate);
    // wait for collection to be created in the background
    while(creationOrder.status !== 'completed') {
        await sleep(1000);
        creationOrder = await handCashMinter.getOrder(creationOrder.id);
    }

    const items = await handCashMinter.getOrderItems(creationOrder.id);
    console.log(`Items Created`, items)
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


