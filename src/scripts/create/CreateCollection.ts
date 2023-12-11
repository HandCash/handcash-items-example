import {ComponentsFactory} from "../../ComponentsFactory.js";
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const result = await handCashMinter.createCollection({
        items: [await ComponentsFactory.getItemsLoader().loadCollection()],
        itemCreationOrderType: 'collection'
    });
    console.log(`Collection Created id: ${result.items[0].id}`);
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


