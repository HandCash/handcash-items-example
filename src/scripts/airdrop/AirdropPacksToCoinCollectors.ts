import { ComponentsFactory } from "../../ComponentsFactory.js";
import dotenv from 'dotenv';
import { CollectorCoinsItemsLoader } from "../../loaders/CollectorCoinsItemsLoader.js";
import { Types } from "@handcash/handcash-connect";

dotenv.config();

const handCashAccount = ComponentsFactory.getHandCashAccount('ed1df2f95413fa0c2a59def83b76aaa72728915e60ded0d80afe5dc39096fff3');
const handCashMinter = ComponentsFactory.getHandCashMinter();

const baseAttributes = [
    {
        displayType: 'string',
        name: 'Storage',
        value: '1TB'
    },
    {
        displayType: 'string',
        name: 'Display',
        value: 'Super Retina XDR display'
    },
    {
        displayType: 'string',
        name: 'Chip',
        value: '21e8 Teranode'
    },
    {
        displayType: 'string',
        name: 'Connectivity',
        value: 'WiFi'
    },
    {
        displayType: 'string',
        name: 'Charging',
        value: 'Wireless Only'
    },
    {
        displayType: 'string',
        name: 'Audio',
        value: 'Headphone Jack'
    },
    {
        displayType: 'string',
        name: 'Camera',
        value: '12MP'
    },
    {
        displayType: 'string',
        name: 'HandCash Pay',
        value: 'Within apps, and on the web'
    },
    {
        displayType: 'string',
        name: 'Operating System',
        value: 'HandCash OS'
    }
];

const greenConsoleItem = {
    name: 'HC PLAY',
    rarity: 'common',
    mediaDetails: {
        image: {
            url: `https://res.cloudinary.com/hn8pdtayf/image/upload/v1740651015/collectors_coin/gold_object.png`,
            contentType: 'image/png',
        },
        multimedia: {
            url: `https://res.cloudinary.com/hn8pdtayf/raw/upload/collectors_coin/gold_object.glb`,
            contentType: 'application/glb',
        }
    },
    attributes: [
        {
            displayType: 'string',
            name: 'Storage',
            value: '1TB'
        },
        {
            displayType: 'string',
            name: 'Chip',
            value: 'Single-Core 21e8 CHRONICLE 3.33 GHz'
        },
    ],
};

const redConsoleItem = {
    name: 'HC PLAY PRO',
    groupingValue: 'HandCash Console · Red',
    rarity: 'rare',
    mediaDetails: {
        image: {
            url: `https://res.cloudinary.com/hn8pdtayf/image/upload/v1740651015/collectors_coin/gold_object.png`,
            contentType: 'image/png',
        },
        multimedia: {
            url: `https://res.cloudinary.com/hn8pdtayf/raw/upload/collectors_coin/gold_object.glb`,
            contentType: 'application/glb',
        }
    },
    attributes: [
        {
            displayType: 'string',
            name: 'Storage',
            value: '2TB'
        },
        {
            displayType: 'string',
            name: 'Chip',
            value: 'Dual-Core 21e8 CHRONICLE 3.33 GHz'
        },
    ],
};

const goldConsoleItem = {
    name: 'HC PLAY ELITE',
    groupingValue: 'HandCash Console · Gold',
    rarity: 'mythic',
    mediaDetails: {
        image: {
            url: `https://res.cloudinary.com/hn8pdtayf/image/upload/v1740651015/collectors_coin/gold_object.png`,
            contentType: 'image/png',
        },
        multimedia: {
            url: `https://res.cloudinary.com/hn8pdtayf/raw/upload/collectors_coin/gold_object.glb`,
            contentType: 'application/glb',
        }
    },
    attributes: [
        {
            displayType: 'string',
            name: 'Storage',
            value: '4TB'
        },
        {
            displayType: 'string',
            name: 'Chip',
            value: 'Quad-Core 21e8 CHRONICLE 3.33 GHz'
        },
    ],
};

async function main() {
    const loader = new CollectorCoinsItemsLoader({ folderPath: './assets/hc_console' });
    const activeUsers = await loader.loadUserIdsFromFile('users-with-payments-2025.csv');
    const goldenTicketOwners = await loader.loadUserIdsFromFile('golden-ticket-owners.csv');
    const usersWithOver5UserSpent = await loader.loadUserIdsFromFile('users-with-over-5-usd-spent.csv');

    const greenUsers = activeUsers.filter(user => !goldenTicketOwners.includes(user) && !usersWithOver5UserSpent.includes(user));
    // users who belong to both usersWithOver5UserSpent and activeUsers
    const redUsers = usersWithOver5UserSpent.filter(user => activeUsers.includes(user) && !goldenTicketOwners.includes(user));
    // Users who belong to both activeUsers and goldenTicketOwners
    const goldUsers = goldenTicketOwners.filter(user => activeUsers.includes(user));
    console.log(`- 📦 Found ${greenUsers.length} active users`);
    console.log(`- 📦 Found ${redUsers.length} users with over 5 USD spent`);
    console.log(`- 📦 Found ${goldUsers.length} golden ticket owners`);

    return;
    await airdropItems('67ebe3eab6b019569398ef01', greenConsoleItem, greenUsers);
    console.log(`- ✅ Green console sent to ${greenUsers.length} user(s)`);
    await airdropItems('67ebe3eab6b019569398ef01', redConsoleItem, redUsers);
    console.log(`- ✅ Red console sent to ${redUsers.length} user(s)`);
    await airdropItems('67ebe3eab6b019569398ef01', goldConsoleItem, goldUsers);
    console.log(`- ✅ Gold console sent to ${goldUsers.length} user(s)`);
}

async function airdropItems(collectionId: string, item: Types.CreateItemMetadata, destinations: String[]) {
    const batchSize = 100;
    const destinationsLeft = [...destinations];
    const totalTarget = Math.min(destinations.length, destinationsLeft.length);
    let totalLeft = Math.min(destinations.length, destinationsLeft.length);
    process.stdout.write(`⏳ Airdropping items (0%). ${totalLeft} items left...`);
    while (totalLeft > 0) {
        const newItems = new Array(Math.min(totalLeft, batchSize))
            .fill(0)
            .reduce((prev, _) => {
                prev.push({
                    ...{
                        ...item,
                        attributes: [
                            ...item.attributes,
                            ...baseAttributes,
                        ]
                    },
                    user: destinationsLeft.pop(),
                });
                return prev;
            }, []);
        totalLeft = Math.min(destinationsLeft.length, destinationsLeft.length);
        await handCashMinter.createItemsOrder({
            items: newItems,
            collectionId: collectionId,
        })
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        const percentageLeft = ((totalTarget - totalLeft) / totalTarget * 100).toFixed(1);
        process.stdout.write(`- ⏳ Airdropping items (${percentageLeft})%. ${totalLeft} items left...`);
    }
}

async function getPackOrigins() {
    const groupingValues = ['1106bcd33400ebf4a849683681e02f11', '68ec3bbd169d300f777e1fe003856e82', '070f818f33608bfbe221bdea8c503c93', '9dac859464042d8917b34def4e2c25e1', '8eb5a250f4a431f8887a519fb7b73387', '67468140c764c68a4e3413e4f225b8b3', '5928601711cbca4daff47eab8a298d96'];
    const packOrigins = [];
    for (const groupingValue of groupingValues) {
        const coinCollectors = await handCashAccount.items.getItemsInventory({ groupingValue: groupingValue, fetchAttributes: false, from: 0, to: 1 });
        packOrigins.push(coinCollectors[0].origin);
    }
    return packOrigins;
}

async function airdropItem(destination: String, origins: String[]) {
    await handCashAccount.items.transfer({
        destinationsWithOrigins: [{
            destination: destination,
            origins: origins
        }]
    });
    console.log(`- ✅ Items sent to ${destination}`);
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
