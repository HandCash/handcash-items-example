import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {inscribeItems} from "./InscribeCollectionItems.js";
import { Types } from "@handcash/handcash-connect";
import pLimit from "p-limit";


const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
      .addArgument(new Argument('<orderId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
   const limit = pLimit(10);
   await Promise.allSettled(Array(Math.floor(52559/10)).fill((0)).map((_, index) => limit(async () => {
    console.log('running', index)
    return handCashMinter.inscribeNextBatch(orderId);
   })));


  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


