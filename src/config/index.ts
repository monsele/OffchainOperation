import {
  createPublicClient,
  createWalletClient,
  http,
  Client
} from "viem";
import { privateKeyToAccount, Account } from "viem/accounts";
import { createBundlerClient, toCoinbaseSmartAccount } from "viem/account-abstraction";
import { baseSepolia, Chain } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ensure this is a string
const RPC_URL = process.env.SEPOLIA_PAYMASTER_URL;
export const client = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
}) as Client;

const owner = privateKeyToAccount(
  PRIVATE_KEY as `0x${string}`,
);

let account: Account;
let bundlerClient: any;

async function initialize() {
  account = await toCoinbaseSmartAccount({
    client,
    owners: [owner],
  });

  bundlerClient = createBundlerClient({
    account,
    client,
    transport: http(RPC_URL),
    chain: baseSepolia,
  });
}

initialize().catch(console.error);

export { account, bundlerClient };