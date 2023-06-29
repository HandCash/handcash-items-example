import {Argument, Command} from "commander";
import {CreateItemsOrder} from "../../services/handcash/Types.js";
import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const [orderId] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the mint order to inscribe the items'))
        .parse(process.argv)
        .args;

    let mintOrder = await handCashService.getCreateItemsOrder(orderId);

    console.log(`- ⏳ Processing ${mintOrder.pendingInscriptions} items...`);
    let itemsLeft = mintOrder.pendingInscriptions;
    while(itemsLeft > 0) {
        mintOrder = await processNextBatch(itemsLeft, orderId)
        itemsLeft = mintOrder.pendingInscriptions;
    }

    console.log(`- ✅ All items completed`);

    const completedOrder = await handCashService.getCreateItemsOrder(orderId);
    console.log('-'.repeat(100));
    if (completedOrder.status !== 'completed') {
        console.log('- ❌ The mint order is not completed yet');
        console.log(`- ${mintOrder.pendingInscriptions} batches remaining`)
        console.log(`- please run \`npm run inscribeItems ${orderId}\` again`)
        return;
    }
    printOrderSummary(completedOrder);
}

async function processNextBatch(index: number, orderId: string) {
    process.stdout.write(`- ⏳ Processing batch #${index}`);
    const mintOrder = await handCashService.mintNextMintBatch(orderId);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`- ✅ Batch #${index} completed\n`);
    return mintOrder;
}

function printOrderSummary(order: CreateItemsOrder) {
    if (order.type === 'collection') {
        console.log(`- 👾Collection created with origin: ${order.items[0].origin}`);
        console.log(`- 📘Run \`npm run createMintCollectionItemsOrder ${order.items[0].id}\` to create items for this collection`);

    } else {
        console.log(`- 👾${order.items.length} item(s) created`);
        if (order.items[0]?.user?.alias) {
            console.log(`- 🦄Item(s) sent to $${order.items[0]?.user!.alias}`);
        }
        console.log(`- 📘Run \`npm run createCatalog ${order.id}\` to create a catalog that contains all the items`);
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
