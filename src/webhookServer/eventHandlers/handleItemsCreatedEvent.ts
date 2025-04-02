import {Types} from "@handcash/handcash-connect";

export default async function itemsCreatedEvent(payload: Types.ItemCreationEventPayload) {
    console.log('----------------------------------')
    console.log('Items Created Event');
    console.log('Item Creation Order: ', payload.data.itemCreationOrder.id);
    console.log('Item Creation Order Status: ', payload.data.itemCreationOrder.status);
    
    console.log('Item Origins: ');
    payload.data.items.forEach((item: any) => {
        console.log(`${item.name} - ${item.origin}`);
    });
    console.log('----------------------------------')
};
