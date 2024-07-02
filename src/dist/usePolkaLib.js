"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var api_1 = require("@polkadot/api");
var api_contract_1 = require("@polkadot/api-contract");
var fs_1 = require("fs");
var contractAddress = "c3g4m37t99TPekSJtpB3dzUqDErYLLtB8agpkXffJsr8kw5e7";
var abi = JSON.parse(fs_1["default"].readFileSync("res/abi.json", "utf8"));
var provider = new api_1.WsProvider("wss://finternet-alpha.cord.network");
var accountAddress = "c3hodLPdNgMfpAbEACV6ff6EMQLfunD3BBcrYxtdxZbtvSJuM";
var toAddressForTransfer = 'c3fBUdBrJEmphgvfKVpBSU1yxbGpGy2b6Cfovyaf3cF2oaWGu';
var value = 50;
function transfer() {
    return __awaiter(this, void 0, void 0, function () {
        var api, contract, keyring, account, gasLimit, contractCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.ApiPromise.create({ provider: provider })];
                case 1:
                    api = _a.sent();
                    contract = new api_contract_1.ContractPromise(api, abi, contractAddress);
                    keyring = new api_1.Keyring({ type: 'sr25519' });
                    account = keyring.addFromUri('<secret>');
                    return [4 /*yield*/, api.derive.balances.account(account.address).then(function (info) { return info.freeBalance.toBigInt(); })];
                case 2:
                    gasLimit = _a.sent();
                    console.log("\n\naccount: " + account + "\n gasLimit: " + gasLimit + "\n");
                    contractCall = contract.tx.transfer({ value: 0, gasLimit: gasLimit }, toAddressForTransfer, value);
                    console.log("\ncontractCall:\n" + contractCall + "\n");
                    contractCall.signAndSend(account, function (_a) {
                        var status = _a.status, events = _a.events;
                        if (status.isInBlock) {
                            console.log("Transaction included at blockHash " + status.asInBlock);
                        }
                        else if (status.isFinalized) {
                            console.log("Transaction finalized at blockHash " + status.asFinalized);
                            events.forEach(function (_a) {
                                var _b = _a.event, data = _b.data, method = _b.method, section = _b.section;
                                console.log("\t" + section + "." + method + ":: " + data);
                                if (section === 'contracts' && method === 'ContractEmitted') {
                                    console.log("Contract event emitted: " + data);
                                }
                                else if (section === 'system' && method === 'ExtrinsicFailed') {
                                    console.error("Extrinsic failed: " + data);
                                }
                                else if (section === 'system' && method === 'ExtrinsicSuccess') {
                                    console.log("Extrinsic succeeded: " + data);
                                }
                            });
                        }
                    })["catch"](function (error) {
                        console.error("Transaction failed: " + error);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
transfer()["catch"](console.error);
