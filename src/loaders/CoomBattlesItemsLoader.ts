import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateItemParameters} from "./Types.js";
import {CreateCatalogParameters} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";

type Params = {
    folderPath: string;
}

export class CoomBattlesItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<Types.CollectionDefinition> {
        return this.loadFromFile();
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
        return {
            appId: handCashConfig.appId,
            title: 'Coom Battles Starter Packs',
            description: 'Champions of Otherworldly Magic limited edition trading cards',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260727/items/Banner_chhigc.jpg',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1686453704/items/151_gif_ndvbqb_pqbmsf.gif',
            totalCollectionItems: 151,
            selectablePacks: [
                {
                    name: '1x Pack',
                    description: 'Includes 1 random card',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138930/items/1_gobyea.png',
                    price: 3,
                    units: 1,
                },
                {
                    name: '10x Pack',
                    description: 'Includes 10 random cards',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138982/items/10_gv2jmo.png',
                    price: 28,
                    units: 10,
                },
                {
                    name: '25x Pack',
                    description: 'Includes 25 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1687358038/items/25-pack_syrigb.png',
                    price: 67,
                    units: 25,
                }
            ],
        };
    }

    private async loadFromFile(): Promise<Types.CollectionDefinition> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        const items = data.map((item: any) => this.loadItemFromRawItemData(item));
        return {
            items,
            collection: {
                name: 'CoOM Battles · First Edition',
                description: 'Champions of Otherworldly Magic limited edition trading cards',
                mediaDetails: {
                    image: {
                        url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1686129013/items/Final_Icon_t9fo6m_cqt3s9_ags7cl.png',
                        contentType: 'image/png',
                    },
                },
                totalQuantity: items.reduce((total: number, item: CreateItemParameters) => total + item.quantity, 0),
            }
        }
    }

    private loadItemFromRawItemData(itemData: any): Types.ItemsMetadataWithQuantity {
        return {
            item: {
                name: itemData['name'],
                rarity: itemData['rarity'],
                attributes: this.getItemAttributes(itemData),
                mediaDetails: {
                    image: {
                        url: `${this.folderPath}/images/${itemData['image']}`,
                        contentType: 'image/png',
                    },
                },
                color: this.getColorFromElement(itemData['element']),
            },
            quantity: itemData['totalQuantity'],
        };
    }

    private getItemAttributes(itemData: any): Types.ItemAttributeMetadata[] {
        return [
            {
                name: 'Edition',
                value: itemData['edition'],
                displayType: 'string',
            },
            {
                name: 'Generation',
                value: itemData['generation'],
                displayType: 'number',
            },
            {
                name: 'Champion Number',
                value: itemData['championNumber'],
                displayType: 'number',
            },
            {
                name: 'Evolutions',
                value: itemData['evolutions'],
                displayType: 'string',
            },
            {
                name: 'Skin',
                value: itemData['skin'],
                displayType: 'string',
            },
            {
                name: 'Element',
                value: itemData['element'],
                displayType: 'string',
            },
            {
                name: 'ManaCost',
                value: itemData['manaCost'],
                displayType: 'number',
            },
            {
                name: 'Health',
                value: itemData['health'],
                displayType: 'number',
            },
            {
                name: 'Attack',
                value: itemData['attack'],
                displayType: 'number',
            },
        ];
    }

    private getColorFromElement(element: string): string {
        switch (element) {
            case 'Fire':
                return '#ed5025';
            case 'Water':
                return '#21bbea';
            case 'Air':
                return '#73c9ac';
            case 'Ice':
                return '#adeaf5';
            case 'Light':
                return '#f4a81b';
            case 'Dark':
                return '#a032ab';
            case 'Earth':
                return '#bf9078';
            case 'Normal':
                return '#828c98';
            case 'Nature':
                return '#40dc29';
            default:
                return '#FFFFFF';
        }
    }

    loadAirdropDestinations(): Promise<String[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/users.json`, 'utf8'));
        const users = data.map((item: any) => ({email: item.email, handle: item.handle}));
        return Promise.resolve(users.map((user: any) => user.handle));
    }
}
