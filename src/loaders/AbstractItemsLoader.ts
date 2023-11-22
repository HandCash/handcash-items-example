import {CreateItemsParameters} from "./Types.js";
import {CreateCatalogParameters, CreateUnlimitedCatalogParameters} from "../services/handcash/Types.js";

export abstract class AbstractItemsLoader {
    abstract loadItems(): Promise<CreateItemsParameters>;

    abstract loadCatalog(): Promise<CreateCatalogParameters>;

    abstract loadUnlimitedCatalog(collectionId: string): Promise<CreateUnlimitedCatalogParameters>;

    abstract loadAirdropDestinations(): Promise<String[]>;
}
