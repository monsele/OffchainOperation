"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAsset = void 0;
const config_1 = require("../config");
const abi_1 = require("../config/abi");
const CreateAsset = async (asset) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "CreateAsset",
            to: abi_1.contractAddress,
            args: [
                asset.propertyTitle,
                asset.totalUnits,
                asset.totalUnits,
                asset.category,
            ],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        return { success: true, result: receipt };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.CreateAsset = CreateAsset;
