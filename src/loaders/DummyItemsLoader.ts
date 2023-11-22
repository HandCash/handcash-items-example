import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateItemParameters, CreateItemsParameters} from "./Types.js";
import {CreateCatalogParameters, ItemAttribute, CreateUnlimitedCatalogParameters} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";

type Params = {
    folderPath: string;
}

export class DummyItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<CreateItemsParameters> {
        return this.loadFromFile();
    }

    private async loadFromFile(): Promise<CreateItemsParameters> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        const items = await Promise.all(data.map((item: any) => this.loadItemFromRawItemData(item)));
        return {
            items,
            collection: {
                name: 'Mystery collection',
                description: 'A mysterious collection with mysterious items',
                mediaDetails: {
                    image: {
                        url: 'https://res.cloudinary.com/handcash-iae/image/upload/v1687295380/items/HeroImage_MysteryBox_wq5iz2_lceykv.jpg',
                        contentType: 'image/png',
                    },
                },
                totalQuantity: items.map((item) => item.quantity).reduce((a, b) => a + b, 0),
            }
        }
    }

    async loadUnlimitedCatalog(collectionId: string): Promise<CreateUnlimitedCatalogParameters> {
        throw new Error('Method not implemented.');
    };

    private async loadItemFromRawItemData(itemData: any): Promise<CreateItemParameters> {
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
                color: '#B19334',
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
        ];
    }

    private getColorFromName(name: string): string {
        const colors = ['#ed5025', '#21bbea', '#73c9ac', '#adeaf5', '#f4a81b', '#bf9078', '#40dc29'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
        return {
            appId: handCashConfig.appId,
            title: 'Dummy Collection Catalog',
            description: 'A dummy collection catalog for testing purposes',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685139151/items/234trgsrdg_ouyxpu.png',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260756/items/collection_gkg3y5.gif',
            totalCollectionItems: 10,
            selectablePacks: [
                {
                    name: '1x Pack',
                    description: 'Not a real pack',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138930/items/1_gobyea.png',
                    price: 0.01,
                    units: 1,
                },
                {
                    name: '10x Pack',
                    description: 'Not a real pack',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138982/items/10_gv2jmo.png',
                    price: 0.09,
                    units: 10,
                },
                {
                    name: '25x Pack',
                    description: 'Not a real pack',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138982/items/10_gv2jmo.png',
                    price: 0.22,
                    units: 25,
                },
            ],
        };
    }

    loadAirdropDestinations(): Promise<String[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/active_users.json`, 'utf8'));
        const users = data.map((item: any) => item['alias']);
        users.push('rjseibane');
        return users;
        return Promise.resolve([
            'apagut',
            'rafa',
            'brandon',
            'nosetwo',
            'alfredo-handcash',
            'brandonc',
        ]);
    }
}
