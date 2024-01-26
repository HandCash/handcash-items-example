import {Argument, Command} from "commander";
import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [orderId] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the order to retrieve'))
        .parse(process.argv)
        .args;

    console.log('- ⏳ Retrieving order...');
    const result = await handCashMinter.getOrder(orderId);
    console.log('============== Order ==============');
    console.log(result);

    if (result.status === 'completed') {
        console.log('===================================')
        console.log('🎉 Order completed successfully!')
        console.log(`run npm run GetOrderItems ${orderId} to get the items`);
        console.log('===================================')
    } else if (result.status === 'pendingInscriptions') {
        console.log('Run npm run InscribeItems', orderId, 'to resume inscribing the items')
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
