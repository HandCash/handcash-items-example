import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();

    console.log(`⏳ Creating mint order of type collection...`);
    let order = await handCashMinter.createCollectionOrder(collectionDefinition.collection);
    console.log(`- ✅ Mint order created. Order ID: ${order.id}`);
    order = await handCashMinter.commitOrder(order.id);
    console.log('- ✅ Mint order committed');

    console.log(`- ⏳ Paying ${order.payment.amountInUSD} USD to inscribe the collection on-chain...`);
    const paymentResult = await handCashMinter.payPaymentRequest(order.payment.paymentRequestId);
    console.log(`- ✅ Order paid. TransactionId: ${paymentResult.transactionId}`);

    console.log(`- ⏳ Inscribing collection...`);
    await handCashMinter.inscribeNextBatch(order.id);
    order = await handCashMinter.getOrder(order.id);
    console.log(`- ✅ Collection inscribed. Use the collectionId: ${order.items[0].id} to inscribe the collection items`);
    // 64c39dedbd39cf8667a6ccb5
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
