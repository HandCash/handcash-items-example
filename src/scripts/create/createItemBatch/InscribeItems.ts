import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import pLimit from "p-limit";


const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;

      let order = await handCashMinter.getOrder(orderId);
      let batchNumber = 0;
      while(order.pendingInscriptions > 0) {
        console.log('Inscribing', order.pendingInscriptions, 'items')
        batchNumber = await inscribeItemsInBatches(order, batchNumber)
        order = await handCashMinter.getOrder(orderId);
      }

      console.log('Run npm run GetInscriptionOrder', order.id, 'to see the order details')
  }

  async function inscribeItemsInBatches (order: any, batchNumber: number) {
    const limit = pLimit(4);
    await Promise.allSettled(Array(8).fill((0)).map(() => limit(async () => {
        console.log('Running batch', batchNumber)
        batchNumber = batchNumber + 1;
        return handCashMinter.inscribeNextBatch(order.id);
    })));
    return batchNumber;
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


