import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {inscribeItems} from "./InscribeCollectionItems.js";
import { Types } from "@handcash/handcash-connect";


const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;

   const order = await handCashMinter.commitOrder(orderId);
   console.log('Order committed, pay the invoice here to continue', order.payment.paymentRequestUrl);
   console.log('Then inscribe items with npm run InscribeItems', orderId);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


