import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();

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
            item.item.mediaDetails.image.imageHighResUrl = item.item.mediaDetails.image.url;
            item.item.mediaDetails.image.url = 'https://cdni.iconscout.com/illustration/free/preview/free-happy-stick-figure-3180134-2673766.png?f=webp&h=700';
            item.item.royalties = [{
                type: 'paymail',
                percentage: 10,
                destination: 'example@championstcg.com'
            }]
            return item.item;
        }),
        itemCreationOrderType: 'collectionItem'
    };
    const result = await handCashMinter.create(params);
    console.log(result)
    console.log(`Items Creation Id: ${result.items}`);
    console.log(`Items Minted: ${result.items.length}`);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


