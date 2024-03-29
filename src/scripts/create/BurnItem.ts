import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [origin] = new Command()
      .addArgument(new Argument('origin', 'The origin of the item to be burn'))
      .parse(process.argv)
      .args;
  
    let burnOrderResult = await handCashMinter.burnAndCreateItemsOrder({
      burn: {
        origins: [origin],
      }
    });
    console.log(`Items Burnt:`, burnOrderResult);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


