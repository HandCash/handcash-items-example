import {handCashConfig} from "../../Settings.js";
import {BigNumber, ECDSA, HD, Mnemonic} from '@bsv/sdk'

const destination = 'rafa';
const amount = 0.01;
const denominatedIn = 'USD';

async function main() {
    const mnemonic = Mnemonic.fromString('oven express radar notice casino leader kidney blame bird window enter resource');
    const hdWallet = HD.fromSeed(mnemonic.toSeed());
    const walletExtendedPublicKey = hdWallet.toPublic().toString();
    const transactionTemplate = await getTransactionTemplate({walletExtendedPublicKey});
    console.log(walletExtendedPublicKey);
    const confirmTransactionParameters = await signTransaction({hdWallet, transactionTemplate});
    const transactionResult = await confirmTransaction({walletExtendedPublicKey, confirmTransactionParameters});
    console.log(JSON.stringify(transactionResult, null, 2));
}

async function getTransactionTemplate(params: { walletExtendedPublicKey: string; }) {
    const response = await fetch('http://localhost:3000/v1/waas/wallet/pay/template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'app-id': handCashConfig.appId,
            'app-secret': handCashConfig.appSecret,
            'wallet-xpub': params.walletExtendedPublicKey,
        },
        body: JSON.stringify({
            note: "Testing Wallet API",
            receivers: [
                {
                    amount: amount,
                    destination: destination,
                    denominationCurrencyCode: denominatedIn,
                }
            ]
        }),
    });
    if (!response.ok) {
        console.error(await response.json());
        throw new Error('Failed to get transaction template');
    } else {
        return response.json();
    }
}

function signTransaction(params: { hdWallet: HD; transactionTemplate: any; }) {
    const signatures = params.transactionTemplate.requiredSignatures.map((rs: any) => {
        const privateKey = params.hdWallet.derive(rs.derivationPath).privKey;
        const signature = ECDSA.sign(new BigNumber(rs.signatureHash, 'hex', 'le'), privateKey);
        return {
            inputIndex: rs.inputIndex,
            publicKey: privateKey.toPublicKey().toDER('hex'),
            signature: signature.toDER('hex'),
        }
    });
    return {
        signatures,
        unsignedTransactionTemplateId: params.transactionTemplate.unsignedTransactionTemplateId,
    }
}

async function confirmTransaction(params: { walletExtendedPublicKey: string; confirmTransactionParameters: any; }) {
    console.log(JSON.stringify(params.confirmTransactionParameters, null, 2));
    const response = await fetch('http://localhost:3000/v1/waas/wallet/pay/broadcast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'app-id': handCashConfig.appId,
            'app-secret': handCashConfig.appSecret,
            'wallet-xpub': params.walletExtendedPublicKey,
        },
        body: JSON.stringify(params.confirmTransactionParameters),
    });
    if (!response.ok) {
        console.error(await response.json());
        throw new Error('Failed to confirm transaction');
    } else {
        return response.json();
    }
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
