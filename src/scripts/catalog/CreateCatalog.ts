import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {Catalog} from "../../services/handcash/Types.js";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const [createItemsOrderId] = new Command()
        .addArgument(new Argument('<createItemsOrderId>', 'The id of the completed create items order'))
        .parse(process.argv)
        .args;

    const catalog = await createCatalog();
    const totalItems = await addItemsToCatalog(catalog.id, createItemsOrderId);
    printCatalogSummary(catalog, totalItems);
}

async function createCatalog(): Promise<Catalog> {
    const catalogParams = await ComponentsFactory.getItemsLoader().loadCatalog();
    console.log(`⏳ Creating a new catalog...`);
    let result = await handCashService.createCatalog(catalogParams);
    console.log(`- ✅ Catalog created. Catalog ID: ${result.id}`);
    return result;
}

async function addItemsToCatalog(catalogId: string, createItemsOrderId: string) {
    const batchSize = 50;
    const order = await handCashService.getCreateItemsOrder(createItemsOrderId);
    let totalItemsLeft = order.items.length;
    let totalItems = order.items.length;
    process.stdout.write(`⏳ Adding items to catalog (0%)`);
    while (totalItemsLeft > 0) {
        const destinations = new Array(Math.min(totalItemsLeft, batchSize))
            .fill(0)
            .reduce((prev, _, index) => {
                prev.push(order.items.pop()!.origin);
                return prev;
            }, []);
        await handCashService.addItemsCatalog({
            itemCatalogId: catalogId,
            itemOrigins: destinations,
        });
        totalItemsLeft = order.items.length;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`- ⏳ Adding items to catalog (${((totalItems - totalItemsLeft) / totalItems * 100).toFixed(1)})%`);
    }
    console.log('\n');
    return order.items.length;
}

function printCatalogSummary(catalog: Catalog, totalItems: number) {
    console.log(`- 👾 The catalog contains ${totalItems} item(s)`);
    console.log('\n');
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
