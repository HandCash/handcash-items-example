import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {Catalog} from "../../services/handcash/Types.js";

const handCashService = ComponentsFactory.getHandCashService();
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [createItemsOrderId] = new Command()
        .addArgument(new Argument('<createItemsOrderId>', 'The id of the completed create items order'))
        .parse(process.argv)
        .args;

    const catalog = await createCatalog();
    printCatalogSummary(catalog, createItemsOrderId);
}

async function createCatalog(): Promise<Catalog> {
    const catalogParams = await ComponentsFactory.getItemsLoader().loadCatalog();
    console.log(`⏳ Creating a new catalog...`);
    let result = await handCashService.createCatalog(catalogParams);
    console.log(`- ✅ Catalog created. Catalog ID: ${result.id}`);
    return result;
}


function printCatalogSummary(catalog: Catalog, createItemsOrderId: string) {
    console.log(`- 👾 add items with npm run addCollectionOrderItemsToCatalog `, catalog.id, createItemsOrderId);
    console.log('- Available packs:');
    catalog.selectablePacks.forEach(pack => {
        console.log(`\t- 📦 ${pack.name}. Payment URL: ${pack.paymentRequestUrl}`);
    });
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
