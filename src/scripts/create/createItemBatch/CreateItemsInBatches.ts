import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";



const handCashMinter = ComponentsFactory.getHandCashMinter();

export async function main() {
    const [collectionId] = new Command()
    .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
    .parse(process.argv)
    .args;

    let order = await handCashMinter.createCollectionItemsOrder(collectionId);
    const items = await ComponentsFactory.getItemsLoader().loadItems();
    let totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    await handCashMinter.addOrderItems({
        orderId: order.id,
        items: items,
        itemCreationOrderType: 'collectionItem'
    });
    console.log(totalQuantity, 'items added to order');
    order = await handCashMinter.commitOrder(order.id);
    console.log('Order committed, pay the invoice here to continue', order.payment.paymentRequestUrl);
    console.log(`- ⏳ Paying ${order.payment!.amountInUSD} USD to create all the items on-chain...`);
    const paymentResult = await handCashMinter.payPaymentRequest(order.payment!.paymentRequestId);
    console.log(`- ✅ Order paid. TransactionId: ${paymentResult.transactionId}`);

    let batchNumber = 1;
    while (order.pendingInscriptions > 0) {
        console.log(`- ⏳ Inscribing batch number ${batchNumber}.\n${order.pendingInscriptions} pending inscriptions...`);
        order = await handCashMinter.inscribeNextBatch(order.id);
        order = await handCashMinter.getOrder(order.id);
        batchNumber++;
    }
    console.log(`- ✅ All items inscribed`);
    console.log('Run npm run getInscriptionOrder', order.id, 'to see the order details')
    
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();

