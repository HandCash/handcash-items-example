import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();
const imageService = ComponentsFactory.getImageService();
async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();
    const params = {
        referencedCollection: collectionId,
        items: collectionDefinition.items.map((item: any) => {
            item.item.quantity = item.quantity;
            return item.item;
        }),
        itemCreationOrderType: 'collectionItem'
    };
    const result = await handCashMinter.createCollectionItems(params);
    console.log(result)
    console.log(`Items Creation Id: ${result.itemCreationOrderId}`);
    console.log(`Items Minted: ${result.items.length}`);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


