import { account, bundlerClient } from "../config";
import { contractABI, contractAddress } from "../config/abi";
import { CreateListing } from "../utils/interface";

export const CreateAsset = async (asset: CreateListing) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "CreateAsset",
      to: contractAddress,
      args: [
        asset.propertyTitle,
        asset.totalUnits,
        asset.totalUnits,
        asset.category,
      ],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.userOpHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};
