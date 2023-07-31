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
    console.log(JSON.stringify(result, null, 2));
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
