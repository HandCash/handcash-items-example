import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();

export async function main() {
    const [collectionId] = new Command()
    .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
    .parse(process.argv)
    .args;

    const order = await createItemOrder(collectionId);
    console.log('To add items to order: npm run AddItemsToOrder', order.id);
}

export async function createItemOrder(collectionId: string) {
    return handCashMinter.createCollectionItemsOrder(collectionId);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();

