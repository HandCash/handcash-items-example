import { ComponentsFactory } from "../../ComponentsFactory.js";
import dotenv from 'dotenv';

dotenv.config();

const handCashAccount = ComponentsFactory.getHandCashAccount();

async function main() {
    const inventoryItems = await handCashAccount.items.getItemsInventory({ groupingValue: '179e4b1b1582afb96e808d566f670aa2', fetchAttributes: true, from: 0, to: 100  });
    console.log(`Found ${inventoryItems.length} items`);
    for (const item of inventoryItems) {
        console.log(`${item.attributes[1].value} - (${item.origin})`);
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
