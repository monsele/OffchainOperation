"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundlerClient = exports.account = exports.client = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const account_abstraction_1 = require("viem/account-abstraction");
const chains_1 = require("viem/chains");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ensure this is a string
const RPC_URL = process.env.SEPOLIA_PAYMASTER_URL;
exports.client = (0, viem_1.createPublicClient)({
    chain: chains_1.baseSepolia,
    transport: (0, viem_1.http)(RPC_URL),
});
const owner = (0, accounts_1.privateKeyToAccount)(PRIVATE_KEY);
let account;
let bundlerClient;
async function initialize() {
    exports.account = account = await (0, account_abstraction_1.toCoinbaseSmartAccount)({
        client: exports.client,
        owners: [owner],
    });
    exports.bundlerClient = bundlerClient = (0, account_abstraction_1.createBundlerClient)({
        account,
        client: exports.client,
        transport: (0, viem_1.http)(RPC_URL),
        chain: chains_1.baseSepolia,
    });
}
initialize().catch(console.error);
