import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashService = ComponentsFactory.getHandCashService();

async function main() {
    const mintParameters = await ComponentsFactory.getItemsLoader().loadItems();
    console.log(`⏳ Creating mint order of type collection...`);
    let result = await handCashService.createMintOrder({
        items: [mintParameters.collection],
        itemCreationOrderType: 'collection'
    });
    console.log(`- ✅ Mint order created. Order ID: ${result.id}`);

    result = await handCashService.commitMintOrder(result.id);
    console.log('- ✅ Mint order committed');
    console.log('- ⏳ Payment pending...');
    console.log(`- 👉 Open the following link to pay the mint order: ${result.payment?.paymentRequestUrl}`)
    console.log('-'.repeat(80));
    console.log(`- 📘After the payment is completed \`npm run inscribeItems ${result.id}\` to inscribe all the items on-chain`);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
