"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundlerClient = exports.account = exports.client = exports.RPC_URL = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const account_abstraction_1 = require("viem/account-abstraction");
const chains_1 = require("viem/chains");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ensure this is a string
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
exports.RPC_URL = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/G5bqtUxbXEF94HhUtGiXKwR3IrAwXDLx";
exports.client = (0, viem_1.createPublicClient)({
    chain: chains_1.baseSepolia,
    transport: (0, viem_1.http)(exports.RPC_URL),
});
const owner = (0, accounts_1.privateKeyToAccount)("0x1912fcd607821c9e4b5c479e270836dac549d340ceaf554f9067bf61f949f97d");
exports.account = await (0, account_abstraction_1.toCoinbaseSmartAccount)({
    client: exports.client,
    owners: [owner],
});
exports.bundlerClient = createBundlerClient({
    account: exports.account,
    client: exports.client,
    transport: (0, viem_1.http)(exports.RPC_URL),
    chain: chains_1.baseSepolia,
});
