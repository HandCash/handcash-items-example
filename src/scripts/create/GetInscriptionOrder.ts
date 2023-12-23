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
    console.log({
        id: result.id,
        status: result.status,
    });

    if (result.status !== 'completed') {
        console.log('Order is not completed yet. Please wait a few seconds and try again.')
        console.log('If order is still not completed after a few minutes, please contact support')
        console.log('===================================')
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
