import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Types} from "@handcash/handcash-connect";

const handCashMinter = ComponentsFactory.getHandCashMinter();

export async function inscribeItems(collectionDefinition: Types.CollectionDefinition, collectionId: string) {
    let totalQuantity = 0;
    const itemsToMint = collectionDefinition.items.map((item: any) => {
        totalQuantity += item.quantity;
        item.item.quantity = item.quantity;
        return item.item;
      });
    if (totalQuantity > 1000) throw new Error('Please reach out to HandCash sales for tips on minting larger quantities of items.');

    console.log(`⏳ Creating mint order of type collectionItems...`);
    let order = await handCashMinter.createCollectionItemsOrder(collectionId);
    console.log(`- ✅ Mint order created. Order ID: ${order.id}`);

    console.log(`- ⏳  Adding ${totalQuantity} items to the order...`);
    await handCashMinter.addOrderItems({
        orderId: order.id,
        items: itemsToMint,
        itemCreationOrderType: 'collectionItem'
    });
    console.log('- ✅  Items added to mint order');

    order = await handCashMinter.commitOrder(order.id);
    console.log('- ✅ Mint order committed');

    console.log(`- ⏳ Paying ${order.payment!.amountInUSD} USD to inscribe all the items on-chain...`);
    const paymentResult = await handCashMinter.payPaymentRequest(order.payment!.paymentRequestId);
    console.log(`- ✅ Order paid. TransactionId: ${paymentResult.transactionId}`);
    order = await handCashMinter.getOrder(order.id);

    while (order.pendingInscriptions > 0) {
        console.log(`- ⏳ Inscribing items. ${order.pendingInscriptions} pending inscriptions...`);
        order = await handCashMinter.inscribeNextBatch(order.id);
        order = await handCashMinter.getOrder(order.id);
    }
    console.log(`- ✅ All items inscribed`);
    console.log('Run npm run getInscriptionOrder', order.id, 'to see the order details')
}
