import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
        .parse(process.argv)
        .args;

    console.log('- ⏳ Creating mint order of type collectionItem...');
    const result = await handCashService.createMintOrder({
        items: [],
        itemCreationOrderType: 'collectionItem',
        referencedCollection: collectionId,
    });
    console.log(`- ✅ Mint order created. Order ID: ${result.id}`);
    console.log(`- 📘 Run \`npm run addCollectionItems ${result.id}\` to add all the items to the order`);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
