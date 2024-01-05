import {Types} from "@handcash/handcash-connect";

export default async function onItemSoldEvent(payload: Types.ItemListingPaymentCompletedEventPayload) {
    console.log('----------------------------------')
    console.log('Item Listing Payment Completed');
    console.log(`Item Listing Sold via Blockchain instant settlement: ${payload.data.transactionRecord.transactionId}`);
    console.log(`Business Wallet transaction received in market fees - ${payload.data?.transactionRecord?.fiatEquivalent.units.toFixed(4)}` 
    + ` ${payload.data?.transactionRecord?.fiatEquivalent.currencyCode} of ${payload.data?.transactionRecord?.currency.code}`);

    const itemsMap = payload.data.items.reduce((map: any, item: any) => map.set(item.origin, item), new Map<string, Types.OrdinalItem>());
    payload.data.itemTransfer.items.forEach((item: any) => {
        const itemMetadata = itemsMap.get(item.origin);
        if(itemMetadata) {
            console.log(`Item ${itemMetadata.origin} ${itemMetadata.name} removed from user inventory: ${item.from.alias}`);
            console.log(`Item ${itemMetadata.origin} ${itemMetadata.name} added to user inventory: ${item.to.alias}`)
        }
    });
    console.log('----------------------------------')
};
