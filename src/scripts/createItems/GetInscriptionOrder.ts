import {Argument, Command} from "commander";
import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const [orderId] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the mint order to retrieve'))
        .parse(process.argv)
        .args;

    const mintParameters = await ComponentsFactory.getItemsLoader().loadItems();
    console.log(JSON.stringify(mintParameters.items));

    console.log('- ⏳ Retrieving mint order...');
    const result = await handCashService.getCreateItemsOrder(orderId);
    console.log(JSON.stringify(result, null, 2));
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
