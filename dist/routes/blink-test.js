// import { PublicKey, TransactionInstruction } from "@solana/web3.js";
// import { createHash } from "crypto";
// import { Router, Request, Response } from "express";
export {};
// // CORS headers for Solana Actions
// const ACTIONS_CORS_HEADERS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
//   'Content-Type': 'routerlication/json',
// };
// const router = Router();
// // Your program ID - replace with actual program ID
// const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "YOUR_PROGRAM_ID_HERE");
// const SOLANA_RPC = process.env.SOLANA_RPC || "https://api.devnet.solana.com";
// // Utility function to generate instruction discriminator
// function getInstructionDiscriminator(instructionName) {
//   const hash = createHash('sha256');
//   hash.update(`global:${instructionName}`);
//   return hash.digest().slice(0, 8);
// }
// // Helper function to create the instruction
// function createProcessAffiliateMintInstruction(accounts, args) {
//   // Get the correct discriminator for your instruction
//   const discriminator = getInstructionDiscriminator('process_affiliate_mint_instruction');
//   // Calculate buffer size needed
//   const campaignNameBytes = Buffer.from(args.campaignName, 'utf8');
//   const bufferSize = 8 + // discriminator
//                     4 + campaignNameBytes.length + // campaign_name (u32 length + string)
//                     32 + // influencer pubkey
//                     32;  // nft_mint_address pubkey
//   const instructionData = Buffer.alloc(bufferSize);
//   let offset = 0;
//   // Write discriminator (8 bytes)
//   discriminator.copy(instructionData, offset);
//   offset += 8;
//   // Write campaign_name (String: u32 length + utf8 bytes)
//   instructionData.writeUInt32LE(campaignNameBytes.length, offset);
//   offset += 4;
//   campaignNameBytes.copy(instructionData, offset);
//   offset += campaignNameBytes.length;
//   // Write influencer pubkey (32 bytes)
//   args.influencer.toBuffer().copy(instructionData, offset);
//   offset += 32;
//   // Write nft_mint_address pubkey (32 bytes)
//   args.nftMintAddress.toBuffer().copy(instructionData, offset);
//   // Create account metas in the exact order from your Rust struct
//   const keys = [
//     { pubkey: accounts.campaign, isSigner: false, isWritable: true },
//     { pubkey: accounts.affiliateLink, isSigner: false, isWritable: true },
//     { pubkey: accounts.buyer, isSigner: true, isWritable: true },
//     { pubkey: accounts.owner, isSigner: false, isWritable: true },
//     { pubkey: accounts.influencer, isSigner: false, isWritable: true },
//     { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
//     { pubkey: accounts.nftEscrow, isSigner: false, isWritable: true },
//     { pubkey: accounts.buyerTokenAccount, isSigner: false, isWritable: true },
//     { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
//     { pubkey: accounts.escrowPdaNftTokenAccount, isSigner: false, isWritable: true },
//     { pubkey: accounts.marketplaceAuthority, isSigner: false, isWritable: false },
//     { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
//     { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
//     { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
//   ];
//   return new TransactionInstruction({
//     keys,
//     programId: PROGRAM_ID,
//     data: instructionData,
//   });
// }
// // Helper function to get campaign details - implement based on your data source
// async function getCampaignDetails(campaignName, nftMint) {
//   // This should fetch campaign details from your database or on-chain data
//   // Return null if campaign doesn't exist or is inactive
//   // Example implementation - replace with your actual data source
//   try {
//     // You could fetch from database, API, or on-chain data here
//     // For now, returning mock data
//     return {
//       name: campaignName,
//       active: true,
//       mintPrice: 1000000000, // 1 SOL in lamports
//       company: "COMPANY_PUBKEY_HERE", // Replace with actual company pubkey
//       imageUrl: "https://via.placeholder.com/300x300",
//       commissionPercentage: 10,
//     };
//   } catch (error) {
//     console.error("Error fetching campaign details:", error);
//     return null;
//   }
// }
// // GET endpoint - Returns the Blink metadata
// router.get("/api/actions/affiliate-mint", async (req: Request, res: Response) => {
//   try {
//     const { campaign, influencer, nft } = req.query;
//     // Validate required parameters
//     if (!campaign || !influencer || !nft) {
//       return res.status(400).json({
//         error: "Missing required parameters: campaign, influencer, nft"
//       });
//     }
//     // Fetch campaign details
//     const campaignDetails = await getCampaignDetails(campaign, nft);
//     if (!campaignDetails) {
//       return res.status(404).json({
//         error: "Campaign not found or inactive"
//       });
//     }
//     const baseHref = `${req.protocol}://${req.get('host')}/api/actions/affiliate-mint?campaign=${campaign}&influencer=${influencer}&nft=${nft}`;
//     const payload = {
//       title: `Mint ${campaignDetails.name} NFT`,
//       icon: campaignDetails.imageUrl || "https://via.placeholder.com/300x300",
//       description: `Mint an NFT from ${campaignDetails.name} campaign through affiliate link. Price: ${campaignDetails.mintPrice / 1000000000} SOL`,
//       label: "Mint NFT",
//       links: {
//         actions: [
//           {
//             label: `Mint for ${campaignDetails.mintPrice / 1000000000} SOL`,
//             href: baseHref,
//           },
//         ],
//       },
//     };
//     res.set(ACTIONS_CORS_HEADERS);
//     res.json(payload);
//   } catch (error) {
//     console.error("GET Error:", error);
//     res.status(400).set(ACTIONS_CORS_HEADERS).json({
//       error: error.message || "An unknown error occurred"
//     });
//   }
// });
// // POST endpoint - Handles the transaction creation
// router.post('/api/actions/affiliate-mint', async (req, res) => {
//   try {
//     const { campaign, influencer, nft } = req.query;
//     const { account } = req.body;
//     if (!campaign || !influencer || !nft) {
//       return res.status(400).json({
//         error: "Missing required parameters"
//       });
//     }
//     if (!account) {
//       return res.status(400).json({
//         error: "Missing account in request body"
//       });
//     }
//     const buyer = new PublicKey(account);
//     const influencerKey = new PublicKey(influencer);
//     const nftMint = new PublicKey(nft);
//     // Get campaign details
//     const campaignDetails = await getCampaignDetails(campaign, nft);
//     if (!campaignDetails || !campaignDetails.active) {
//       throw new Error("Campaign not found or inactive");
//     }
//     // Derive PDAs
//     const [campaignPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from("nft_campaign"), Buffer.from(campaign), nftMint.toBuffer()],
//       PROGRAM_ID
//     );
//     const [affiliateLinkPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from("affiliate_link"), influencerKey.toBuffer(), Buffer.from(campaign)],
//       PROGRAM_ID
//     );
//     const [nftEscrowPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from("nft_escrow"), Buffer.from(campaign), nftMint.toBuffer()],
//       PROGRAM_ID
//     );
//     const [marketplaceAuthorityPda] = PublicKey.findProgramAddressSync(
//       [Buffer.from("marketplace_authority")],
//       PROGRAM_ID
//     );
//     // Get associated token accounts
//     const buyerTokenAccount = await getAssociatedTokenAddress(
//       nftMint,
//       buyer,
//       false,
//       TOKEN_2022_PROGRAM_ID
//     );
//     const ownerTokenAccount = await getAssociatedTokenAddress(
//       nftMint,
//       new PublicKey(campaignDetails.company),
//       false,
//       TOKEN_2022_PROGRAM_ID
//     );
//     const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(
//       nftMint,
//       nftEscrowPda,
//       true,
//       TOKEN_2022_PROGRAM_ID
//     );
//     // Create connection
//     const connection = new Connection(SOLANA_RPC);
//     // Build transaction
//     const transaction = new Transaction();
//     // Check if buyer token account exists, create if needed
//     const buyerTokenAccountInfo = await connection.getAccountInfo(buyerTokenAccount);
//     if (!buyerTokenAccountInfo) {
//       transaction.add(
//         createAssociatedTokenAccountInstruction(
//           buyer,
//           buyerTokenAccount,
//           buyer,
//           nftMint,
//           TOKEN_2022_PROGRAM_ID
//         )
//       );
//     }
//     // Create the affiliate mint instruction
//     const instruction = createProcessAffiliateMintInstruction({
//       campaign: campaignPda,
//       affiliateLink: affiliateLinkPda,
//       buyer: buyer,
//       owner: new PublicKey(campaignDetails.company),
//       influencer: influencerKey,
//       nftMint: nftMint,
//       nftEscrow: nftEscrowPda,
//       buyerTokenAccount: buyerTokenAccount,
//       ownerTokenAccount: ownerTokenAccount,
//       escrowPdaNftTokenAccount: escrowPdaNftTokenAccount,
//       marketplaceAuthority: marketplaceAuthorityPda,
//       tokenProgram: TOKEN_2022_PROGRAM_ID,
//       associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
//       systemProgram: SystemProgram.programId,
//     }, {
//       campaignName: campaign,
//       influencer: influencerKey,
//       nftMintAddress: nftMint,
//     });
//     transaction.add(instruction);
//     // Set recent blockhash and fee payer
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = buyer;
//     // Serialize transaction
//     const serializedTransaction = transaction.serialize({
//       requireAllSignatures: false,
//       verifySignatures: false,
//     });
//     const payload = {
//       transaction: serializedTransaction.toString('base64'),
//       message: `Successfully created transaction to mint NFT from ${campaign} campaign!`,
//     };
//     res.set(ACTIONS_CORS_HEADERS);
//     res.json(payload);
//   } catch (error) {
//     console.error("POST Error:", error);
//     res.status(400).set(ACTIONS_CORS_HEADERS).json({
//       error: error.message || "An unknown error occurred"
//     });
//   }
// });
// // OPTIONS endpoint for CORS preflight
// router.options('/api/actions/affiliate-mint', (req, res) => {
//   res.set(ACTIONS_CORS_HEADERS);
//   res.status(200).end();
// });
// // Health check endpoint
// router.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });
// // Error handling middleware
// router.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);
//   res.status(500).set(ACTIONS_CORS_HEADERS).json({
//     error: 'Internal server error'
//   });
// });
// // Export the router to be mounted in your main server file (e.g., app.ts or index.ts)
// export default router;
