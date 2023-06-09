import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateItemParameters, CreateItemsParameters} from "./Types.js";
import {CreateCatalogParameters, ItemAttribute} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";

type Params = {
    folderPath: string;
}

export class CoomBattlesItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<CreateItemsParameters> {
        return this.loadFromFile();
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
        return {
            appId: handCashConfig.appId,
            title: 'Coom Battles Starter Packs',
            description: 'Coom Battles is a collectible card game where you can battle your friends!',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260727/items/Banner_chhigc.jpg',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260756/items/collection_gkg3y5.gif',
            totalCollectionItems: 10,
            selectablePacks: [
                {
                    name: '1x Pack',
                    description: '',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138930/items/1_gobyea.png',
                    price: 0.02,
                    units: 1,
                },
                {
                    name: '10x Pack',
                    description: '',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138982/items/10_gv2jmo.png',
                    price: 0.10,
                    units: 10,
                },
                {
                    name: '100x Pack',
                    description: '',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138964/items/100_wvbfi3.png',
                    price: 0.90,
                    units: 100,
                }
            ],
        };
    }

    private async loadFromFile(): Promise<CreateItemsParameters> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        const items = data.map((item: any) => this.loadItemFromRawItemData(item));
        return {
            items,
            collection: {
                name: 'Coom Battles',
                description: 'Coom Battles is a collectible card game where you can battle your friends and earn BCH!',
                mediaDetails: {
                    image: {
                        url: 'https://res.cloudinary.com/handcash/image/upload/v1685119108/Final_Icon_t9fo6m.png',
                        contentType: 'image/png',
                    },
                },
                totalQuantity: items.reduce((total: number, item: CreateItemParameters) => total + item.quantity, 0),
            }
        }
    }

    private loadItemFromRawItemData(itemData: any): CreateItemParameters {
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

    private getItemAttributes(itemData: any): ItemAttribute[] {
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
        return Promise.resolve([]);
    }
}
