import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";


const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;

   const order = await commitOrder(orderId);
   console.log(`- ⏳ Order cost ${order.payment!.amountInUSD} USD.`);
   console.log(`Run npm run PayOrder ${order.id} to pay the order`);
  }
  
export async function commitOrder(orderId: string) {
    return handCashMinter.commitOrder(orderId);
};

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


