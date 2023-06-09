import {CreateItemsCollection, CreateItemsCollectionItem} from "../services/handcash/Types.js";

export type CreateItemParameters = {
    item: CreateItemsCollectionItem;
    quantity: number;
}

export type CreateItemsParameters = {
    collection: CreateItemsCollection;
    items: CreateItemParameters[];
}
