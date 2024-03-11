import {Argument, Command} from "commander";
import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashMinter = ComponentsFactory.getHandCashMinter();
const handcashAccount = ComponentsFactory.getHandCashAccount();

async function main() {
    const [orderId] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the order to retrieve'))
        .parse(process.argv)
        .args;

    const items = await handCashMinter.getOrderItems(orderId);
    console.log('============== Items ==============');
    console.log(items);
    console.log('===================================')
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
