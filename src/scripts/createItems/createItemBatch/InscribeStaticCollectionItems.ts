import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {inscribeItems} from "./InscribeCollectionItems.js"

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
        .parse(process.argv)
        .args;

    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();
    await inscribeItems(collectionDefinition, collectionId);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
