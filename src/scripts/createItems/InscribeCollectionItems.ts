import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
        .parse(process.argv)
        .args;

    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();

    console.log(`⏳ Creating mint order of type collectionItems...`);
    let order = await handCashMinter.createCollectionItemsOrder(collectionId);
    console.log(`- ✅ Mint order created. Order ID: ${order.id}`);

    console.log(`- ⏳  Adding ${collectionDefinition.collection.totalQuantity} items to the order...`);
    for (const itemMetadata of collectionDefinition.items) {
        const items = new Array(itemMetadata.quantity).fill(0).map(() => itemMetadata.item);
        console.log(`- ⏳  Adding ${itemMetadata.quantity} unit(s) of item named ${itemMetadata.item.name}...`);
        await handCashMinter.addOrderItems({
            orderId: order.id,
            items,
            itemCreationOrderType: 'collectionItem'
        });
    }
    console.log('- ✅  Items added to mint order');

    order = await handCashMinter.commitOrder(order.id);
    console.log('- ✅ Mint order committed');

    console.log(`- ⏳ Paying ${order.payment.amountInUSD} USD to inscribe all the items on-chain...`);
    const paymentResult = await handCashMinter.payPaymentRequest(order.payment.paymentRequestId);
    console.log(`- ✅ Order paid. TransactionId: ${paymentResult.transactionId}`);
    order = await handCashMinter.getOrder(order.id);

    while (order.pendingInscriptions > 0) {
        console.log(`- ⏳ Inscribing items. ${order.pendingInscriptions} pending inscriptions...`);
        order = await handCashMinter.inscribeNextBatch(order.id);
    }
    console.log(`- ✅ All items inscribed`);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();