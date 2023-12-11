import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";


const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
      let order = await handCashMinter.getOrder(orderId);
      if(order.pendingInscriptions === 0) {
        console.log('All items created');
        return;
      }
      console.log(`Remaining pending inscriptions for order`, order.pendingInscriptions);
      await handCashMinter.inscribeNextBatch(orderId);
      order = await handCashMinter.getOrder(orderId);
      if(order.pendingInscriptions > 0) {
        console.log(`Remaining pending inscriptions for order`, order.pendingInscriptions);
        console.log(`To create the next batch of items run, npm run CreateNextItemBatch ${order.id}`)
      } else {
        console.log('All items created');
      };
  }

  export async function createNextItemBatch (orderId: string) {
    return handCashMinter.inscribeNextBatch(orderId);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


