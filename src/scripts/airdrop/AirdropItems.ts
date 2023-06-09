import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {CreateItemsCollectionItem} from "../../services/handcash/Types.js";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const [createItemsOrderId] = new Command()
        .addArgument(new Argument('<createItemsOrderId>', 'The id of the completed create items order'))
        .parse(process.argv)
        .args;

    const { items } = await handCashService.getCreateItemsOrder(createItemsOrderId);
    const destinations = await ComponentsFactory.getItemsLoader().loadAirdropDestinations();
    console.log(`- ✅ Loaded ${items.length} item(s) to airdrop them to ${destinations.length} user(s)`);
    await airdropItems(items, destinations);
    console.log(`- ✅ The items where successfully sent!`);
}

function popRandomItem(items: any[]) {
    return items.splice(Math.round(Math.random() * (items.length - 1)), 1).pop()
}

async function airdropItems(items: CreateItemsCollectionItem[], destinations: String[]) {
    const batchSize = 2000;
    const itemsLeft = [...items];
    const destinationsLeft = [...destinations];
    const totalTarget = Math.min(destinations.length, itemsLeft.length);
    let totalLeft = Math.min(destinations.length, itemsLeft.length);
    process.stdout.write(`⏳ Airdropping items (0%). ${totalLeft} items left...`);
    while (totalLeft > 0) {
        const destinationsWithOrigins = new Array(Math.min(totalLeft, batchSize))
            .fill(0)
            .reduce((prev, _, index) => {
                prev.push({
                    destination: popRandomItem(destinationsLeft),
                    origins: [popRandomItem(itemsLeft).origin],
                });
                return prev;
            }, []);
        totalLeft = Math.min(destinationsLeft.length, itemsLeft.length);
        await ComponentsFactory.getHandCashService().transferItems({destinationsWithOrigins});
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        const percentageLeft = ((totalTarget - totalLeft) / totalTarget * 100).toFixed(1);
        process.stdout.write(`- ⏳ Airdropping items (${percentageLeft})%. ${totalLeft} items left...`);
    }
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
