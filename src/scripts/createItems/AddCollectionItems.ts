import {ComponentsFactory} from "../../ComponentsFactory.js";
import {CreateItemParameters} from "../../loaders/Types.js";
import {Argument, Command} from "commander";
import pLimit from "p-limit";

const handCashService = ComponentsFactory.getHandCashService();
const imageService = ComponentsFactory.getImageService();

async function main() {
    const [orderId] = new Command()
        .addArgument(new Argument('<orderId>', 'The id of the mint order to add items to'))
        .parse(process.argv)
        .args;

    const mintParameters = await ComponentsFactory.getItemsLoader().loadItems();
    const order = await handCashService.getCreateItemsOrder(orderId);
    const items = mintParameters.items.slice(order.items.length);
    const limit = pLimit(1);
    console.log(`- ⏳  Adding ${items.length} items to mint order ${orderId}...`);
    await Promise.all(items.map((itemParams) => limit(() => addCollectionItem(orderId, itemParams))));
    console.log('- ✅  Items added to mint order');

    const committedMintOrder = await commitMintOrder(orderId);
    console.log('- ✅  Mint order committed');
    console.log('- ⏳  Payment pending...');
    console.log(`- 👉  Open the following link to pay the mint order: ${committedMintOrder.payment?.paymentRequestUrl}`)
    console.log('-'.repeat(80));
    console.log(`- 📘  After the payment is completed \`npm run inscribeItems ${committedMintOrder.id}\` to inscribe all the items on-chain`);
}

async function addCollectionItem(orderId: string, mintItem: CreateItemParameters) {
    const {imageUrl} = await imageService.uploadImage(mintItem.item.mediaDetails.image.url);
    mintItem.item.mediaDetails.image.url = imageUrl;
    const items = new Array(mintItem.quantity).fill(0).map(() => mintItem.item);
    console.log(`- ⏳  Adding ${mintItem.quantity} items named ${mintItem.item.name}...`);
    return handCashService.addMintOrderItems({orderId, items, itemCreationOrderType: 'collectionItem'});
}

async function commitMintOrder(orderId: string) {
    return handCashService.commitMintOrder(orderId);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
