import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import fs from "fs";


async function main() {
  const provider = new WsProvider("wss://finternet-alpha.cord.network");
  const api = await ApiPromise.create({ provider });
  const abi = JSON.parse(fs.readFileSync("res/abi.json", "utf8"));
  const contractAddress = "c3g4m37t99TPekSJtpB3dzUqDErYLLtB8agpkXffJsr8kw5e7";
  const accountAddress = "c3hodLPdNgMfpAbEACV6ff6EMQLfunD3BBcrYxtdxZbtvSJuM";
  const contract = new ContractPromise(api, abi, contractAddress);

}

main();
