import {Types} from "@handcash/handcash-connect";

export default async function itemsTransferredEvent(payload: Types.ItemsTransferredEventPayload) {
    console.log('----------------------------------')
    console.log('Items Transferred');
    payload.data.itemTransfer.items.forEach((item: any) => {
        console.log(`Item ${item.origin} removed from user inventory: ${item.from.alias}`);
        console.log(`Item ${item.origin} added to user inventory: ${item.to.alias}`)

    });
    console.log('----------------------------------')
};
