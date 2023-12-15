import {Types} from "@handcash/handcash-connect";

import {CreateCatalogParameters} from "../services/handcash/Types.js";
export abstract class AbstractItemsLoader {
    abstract loadItems(): Promise<Types.CreateItemMetadata[]>;

    abstract loadCollection(): Promise<Types.CreateCollectionMetadata>;

    abstract loadCatalog(): Promise<CreateCatalogParameters>;

    abstract loadAirdropDestinations(): Promise<String[]>;
}
