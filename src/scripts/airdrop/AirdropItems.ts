import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {Types} from "@handcash/handcash-connect";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the collection to airdrop items from.'))
        .parse(process.argv)
        .args;

    const [item] = await ComponentsFactory.getItemsLoader().loadItems();
    const destinations = await ComponentsFactory.getItemsLoader().loadAirdropDestinations();
    console.log(`- ✅ Loaded item(s) to airdrop them to ${destinations.length} user(s) for collection ${collectionId}...`);
    await airdropItems(collectionId, item, destinations);
    console.log(`- ✅ The items where successfully sent!`);
}

function popRandomItem(items: any[]) {
    return items.splice(Math.round(Math.random() * (items.length - 1)), 1).pop()
}

async function airdropItems(collectionId: string, item: Types.CreateItemMetadata, destinations: String[]) {
    const batchSize = 100;
    const destinationsLeft = [...destinations];
    const totalTarget = Math.min(destinations.length, destinationsLeft.length);
    let totalLeft = Math.min(destinations.length, destinationsLeft.length);
    process.stdout.write(`⏳ Airdropping items (0%). ${totalLeft} items left...`);
    while (totalLeft > 0) {
        const newItems = new Array(Math.min(totalLeft, batchSize))
            .fill(0)
            .reduce((prev, _) => {
                prev.push({
                    ...item,
                    user: popRandomItem(destinationsLeft),
                });
                return prev;
            }, []);
        totalLeft = Math.min(destinationsLeft.length, destinationsLeft.length);
        await handCashMinter.createItemsOrder({
            items: newItems,
            collectionId: collectionId,
        })
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
