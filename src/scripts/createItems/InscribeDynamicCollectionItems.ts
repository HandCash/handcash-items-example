import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
import {faker} from "@faker-js/faker";
import {Types} from "@handcash/handcash-connect";
import {inscribeItems} from "./InscribeCollectionItems.js";

async function main() {
    const [collectionId] = new Command()
        .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
        .parse(process.argv)
        .args;

    const collectionDefinition = await ComponentsFactory.loadCollectionDefinition();

    // Generate dynamic items
    collectionDefinition.items = new Array(50).fill(0).map((_, index) => {
        const itemName = faker.person.fullName();
        const item: Types.ItemsMetadataWithQuantity = {
            item: {
                name: itemName,
                description: faker.lorem.sentence(),
                mediaDetails: {
                    image: {
                        url: `https://robohash.org/${itemName}`,
                        contentType: 'image/png'
                    }
                },
                color: faker.color.rgb(),
                rarity: index % 2 === 0 ? 'common' : 'rare',
                attributes: [
                    {
                        name: 'Country',
                        value: faker.location.county(),
                        displayType: 'string'
                    }
                ]
            },
            quantity: 1
        };
        return item;
    });
    await Promise.all(
        collectionDefinition.items.map(async (item: Types.ItemsMetadataWithQuantity) => {
            const {imageUrl} = await ComponentsFactory.getImageService().uploadImage(item.item.mediaDetails.image.url);
            item.item.mediaDetails.image.url = imageUrl;
        })
    );

    await inscribeItems(collectionDefinition, collectionId);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
