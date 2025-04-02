import {ComponentsFactory} from "../../ComponentsFactory.js";

const handCashAccount = ComponentsFactory.getHandCashAccount();
const sendAmountInUsd = 5;

async function main() {
    const destinations = [
        'brandonC',
        'VVerT',
        'sergii.poznokos',
        'mortling',
        'twat',
        'rubyy',
        'victordetroy',
        'Jane_Nuts',
        'acidpointer',
        'pavlo.kh',
        'KnowThyFulcrum',
        'voharak'
    ];
    await sendFunds(destinations);
    console.log(`- ✅ The funds were successfully sent!`);
}

async function sendFunds(destinations: String[]) {
    const batchSize = 100;
    const destinationsLeft = [...destinations];
    const totalTarget = destinations.length;
    let totalLeft = Math.min(destinations.length, destinationsLeft.length);
    process.stdout.write(`⏳ Sending funds (0%). ${totalLeft} items left...`);
    while (totalLeft > 0) {
        const payments = new Array(Math.min(totalLeft, batchSize))
            .fill(0)
            .reduce((prev, _) => {
                const destination = destinationsLeft.pop();
                prev.push({
                    destination,
                    currencyCode: 'USD',
                    sendAmount: sendAmountInUsd,
                });
                return prev;
            }, []);
        totalLeft = destinationsLeft.length;
        await handCashAccount.wallet.pay({
            description: 'For testing 👾',
            payments,
        });
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        const percentageLeft = ((totalTarget - totalLeft) / totalTarget * 100).toFixed(1);
        process.stdout.write(`- ⏳ Sending funds (${percentageLeft})%. ${totalLeft} receivers left...`);
    }
    process.stdout.write(`\n`);
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
