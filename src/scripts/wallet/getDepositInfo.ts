import {handCashConfig} from "../../Settings.js";
import {HD, Mnemonic} from '@bsv/sdk'

async function main() {
    const mnemonic = Mnemonic.fromString('oven express radar notice casino leader kidney blame bird window enter resource');
    const hdWallet = HD.fromSeed(mnemonic.toSeed());
    const walletExtendedPublicKey = hdWallet.toPublic().toString();
    const depositInfo = await getDepositInfo({walletExtendedPublicKey});
    console.log(JSON.stringify(depositInfo, null, 2));
}

async function getDepositInfo(params: { walletExtendedPublicKey: string; }) {
    const response = await fetch('http://localhost:3000/v1/waas/wallet/depositInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'app-id': handCashConfig.appId,
            'app-secret': handCashConfig.appSecret,
            'wallet-xpub': params.walletExtendedPublicKey,
        },
    });
    if (!response.ok) {
        console.error(await response.json());
        throw new Error('Failed to get deposit info');
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
