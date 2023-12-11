import {ComponentsFactory} from "../../../ComponentsFactory.js";
import {Argument, Command} from "commander";

const handCashMinter = ComponentsFactory.getHandCashMinter();

export async function main() {
    const [orderId] = new Command()
    .addArgument(new Argument('<orderId>', 'The id of the order to pay'))
    .parse(process.argv)
    .args;

    const order = await payItemCreationOrder(orderId);
    console.log('To create the next batch of items npm run CreateNextItemBatch', orderId);
}

export async function payItemCreationOrder(orderId: string) {
    const order = await handCashMinter.getOrder(orderId);
    console.log(`- ⏳ Paying ${order.payment!.amountInUSD} USD to inscribe all the items on-chain...`);
    const paymentResult = await handCashMinter.payPaymentRequest(order.payment!.paymentRequestId);
    console.log(`- ✅ Order paid. TransactionId: ${paymentResult.transactionId}`);
    return paymentResult
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();

