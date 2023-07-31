import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const account = ComponentsFactory.getHandCashAccount();

async function main() {
    const [origin, destination] = new Command()
        .addArgument(new Argument('<origin>', 'Item origin'))
        .addArgument(new Argument('<destination>', 'Handle or address'))
        .parse(process.argv)
        .args;

    const result = await account.items.transfer({
        destinationsWithOrigins: [
            {destination, origins: [origin]}
        ]
    })
    console.log(`- ✅ Item transferred to ${destination}!`);
    console.log(JSON.stringify(result, null, 2));
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
