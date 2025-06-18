import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createBundlerClient, toCoinbaseSmartAccount } from "viem/account-abstraction";
import { baseSepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ensure this is a string
const RPC_URL = process.env.SEPOLIA_PAYMASTER_URL;
export const client = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
});
const owner = privateKeyToAccount(PRIVATE_KEY);
let account;
let bundlerClient;
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
