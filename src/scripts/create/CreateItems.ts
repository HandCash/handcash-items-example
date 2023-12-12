import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const result = await handCashMinter.createItems({
        referencedCollection: collectionId,
        items: await ComponentsFactory.getItemsLoader().loadItems(),
        itemCreationOrderType: 'collectionItem'
    });
    console.log(`Items Minted: ${result.items.length}`);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


