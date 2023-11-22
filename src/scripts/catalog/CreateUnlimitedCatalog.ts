import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {Catalog} from "../../services/handcash/Types.js";

const handCashService = ComponentsFactory.getHandCashService();
const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the completed create items order'))
        .parse(process.argv)
        .args;

    const catalog = await createCatalog(collectionId);
    printCatalogSummary(catalog);
}

async function createCatalog(collectionId: string): Promise<Catalog> {
    const catalogParams = await ComponentsFactory.getItemsLoader().loadUnlimitedCatalog(collectionId);
    console.log(`⏳ Creating a new catalog...`);
    let result = await handCashService.createUnlimitedCatalog(catalogParams);
    console.log(`- ✅ Catalog created. Catalog ID: ${result.id}`);
    return result;
}


function printCatalogSummary(catalog: Catalog) {
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
