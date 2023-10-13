import { Argument, Command } from "commander";
import { ComponentsFactory } from "../../ComponentsFactory.js";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [ orderId, handle ] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the order to retrieve'))
        .addArgument(new Argument('<handle>', 'The handle to send items to'))
        .parse(process.argv)
        .args;
    
    console.log('- ⏳ Retrieving order items...');
    const items = await handCashMinter.getOrderItems(orderId);

    const destinationsWithOrigins = [{
        destination: handle,
        origins: items.map((item: any) => item.origin)
    }];
    console.log(`- 🚀 Sending ${items.length} items to ${handle}...`);
    await ComponentsFactory.getHandCashAccount().items.transfer({ destinationsWithOrigins });
    console.log(`- ✅ Items successfully sent to ${handle}!`);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e);
    }
})();
