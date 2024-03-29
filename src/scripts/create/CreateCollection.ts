import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashMinter = ComponentsFactory.getHandCashMinter();


function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function main() {
    const collection = await ComponentsFactory.getItemsLoader().loadCollection();
    let creationOrder = await handCashMinter.createCollectionOrder(collection);
    // wait for collection to be created in the background
    await sleep(5000);

    const items = await handCashMinter.getOrderItems(creationOrder.id);
    console.log(`Collection Created id: ${items[0].id}`)
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


