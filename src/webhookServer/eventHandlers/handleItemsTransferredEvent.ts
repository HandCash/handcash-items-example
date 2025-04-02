import {Types} from "@handcash/handcash-connect";

export default async function itemsTransferredEvent(payload: Types.ItemsTransferredEventPayload) {
    console.log('----------------------------------')
    console.log('Items Transferred');
    console.log(JSON.stringify(payload, null, 2));
    payload.data.itemTransfer.items.forEach((item: any) => {
        console.log('User id', item.to.id )
        console.log('from id', item.from.id )
        console.log(`Item ${item.origin} removed from user inventory: ${item.from.alias}`);
        console.log(`Item ${item.origin} added to user inventory: ${item.to.alias}`)
    });
    console.log('----------------------------------')
};
