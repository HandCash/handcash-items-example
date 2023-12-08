import {ComponentsFactory} from "../../ComponentsFactory.js";
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();
    const params = {
        items: [collectionDefinition.collection],
        itemCreationOrderType: 'collection'
    };
    const result = await handCashMinter.create(params);
    console.log(`Collection Created id: ${result.items[0].id}`);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


