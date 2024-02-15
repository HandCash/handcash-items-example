import {Types} from "@handcash/handcash-connect";

export default async function onItemSoldEvent(payload: Types.ItemListingPaymentCompletedEventPayload) {
    console.log('----------------------------------')
    console.log('Item Listing Payment Completed');

    console.log('Item Transfer: ', payload.data.itemTransfer.id);
    console.log('Payment: ', payload.data.itemTransfer.payment.transactionId)
    console.log('Payment Amount: ', payload.data.itemTransfer.payment.amount, payload.data.itemTransfer.payment.currencyCode) 
    payload.data.itemTransfer.items.forEach((item: any) => {
        console.log('User id', item.to.id )
        console.log('from id', item.from.id )
        console.log(`Item ${item.origin} removed from user inventory: ${item.from.alias}`);
        console.log(`Item ${item.origin} added to user inventory: ${item.to.alias}`)
    });

    console.log('----------------------------------')
};
