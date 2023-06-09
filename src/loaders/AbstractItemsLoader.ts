import {CreateItemsParameters} from "./Types.js";
import {CreateCatalogParameters} from "../services/handcash/Types.js";

export abstract class AbstractItemsLoader {
    abstract loadItems(): Promise<CreateItemsParameters>;

    abstract loadCatalog(): Promise<CreateCatalogParameters>;

    abstract loadAirdropDestinations(): Promise<String[]>;
}
