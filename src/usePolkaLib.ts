import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import fs from 'fs';

const contractAddress = "c3g4m37t99TPekSJtpB3dzUqDErYLLtB8agpkXffJsr8kw5e7";
const abi = JSON.parse(fs.readFileSync("res/abi.json", "utf8"));
const provider = new WsProvider("wss://finternet-alpha.cord.network");
const accountAddress = "c3hodLPdNgMfpAbEACV6ff6EMQLfunD3BBcrYxtdxZbtvSJuM";
const toAddressForTransfer = 'c3fBUdBrJEmphgvfKVpBSU1yxbGpGy2b6Cfovyaf3cF2oaWGu';
const value = 50; 

async function transfer() {
    const api = await ApiPromise.create({ provider });
    const contract = new ContractPromise(api, abi, contractAddress);
    const keyring = new Keyring({ type: 'sr25519' });

    const account = keyring.addFromUri('<secret>');
    const gasLimit = 6200910 * 4291
    console.log(`\n\naccount: ${account}\n gasLimit: ${gasLimit}\n`)
    const contractCall = contract.tx.transfer({ value: 0, gasLimit }, toAddressForTransfer, value);
    console.log(`\ncontractCall:\n${contractCall}\n`)
    contractCall.signAndSend(account, ({ status, events }) => {
        if (status.isInBlock) {
            console.log(`Transaction included at blockHash ${status.asInBlock}`);
        } else if (status.isFinalized) {
            console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
            events.forEach(({ event: { data, method, section } }) => {
                console.log(`\t${section}.${method}:: ${data}`);
                if (section === 'contracts' && method === 'ContractEmitted') {
                    console.log(`Contract event emitted: ${data}`);
                } else if (section === 'system' && method === 'ExtrinsicFailed') {
                    console.error(`Extrinsic failed: ${data}`);
                } else if (section === 'system' && method === 'ExtrinsicSuccess') {
                    console.log(`Extrinsic succeeded: ${data}`);
                }
            });
        }
    }).catch((error) => {
        console.error(`Transaction failed: ${error}`);
    });
}

transfer().catch(console.error);
