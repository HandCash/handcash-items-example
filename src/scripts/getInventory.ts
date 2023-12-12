import {ComponentsFactory} from "../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handcashAccount = ComponentsFactory.getHandCashAccount();

async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
      const items = await handcashAccount.items.getItemsInventory({ collectionId });
      console.log(items);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})(); 
