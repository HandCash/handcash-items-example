import { HandCashConnect } from "@handcash/handcash-connect";
import { ComponentsFactory } from "../../ComponentsFactory.js";
import dotenv from 'dotenv';

dotenv.config();

const handCashAccount = new HandCashConnect({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
}).getAccountFromAuthToken(process.env.AUTH_TOKEN);

async function main() {
    console.log('Skipped');
    return;
    // const destinations = await ComponentsFactory.getItemsLoader().loadAirdropDestinations();
    const destinations = ['KnowThyFulcrum', 'twat', 'mortling', 'rubyy', 'Jane_Nuts', 'pavlo.kh', 'i.nechytailo', 'voharak', 'brandonc', 'rjseibane'];
    for (const destination of destinations) {
        try {
            await airdropItem(destination);
        } catch (e) {
            console.error(`- ❌ Error sending item to ${destination}: `, e);
        }
    }
    console.log(`- ✅ The items where successfully sent to ${destinations.length} user(s)`);
}

// Select an item based on custom criteria
async function findItem() {
    const inventoryItems = await handCashAccount.items.getItemsInventory({ groupingValue: '179e4b1b1582afb96e808d566f670aa2', fetchAttributes: true });
    const randomIndex = Math.floor(Math.random() * inventoryItems.length);
    return inventoryItems[randomIndex];
}

async function airdropItem(destination: String) {
    const item = await findItem();
    const itemOrigin = item.origin;

    await handCashAccount.items.transfer({
        destinationsWithOrigins: [{
            destination: destination,
            origins: [itemOrigin]
        }]
    });
    console.log(`- ✅ Item ${item.name} (${itemOrigin}) sent to ${destination}`);
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
