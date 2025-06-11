import { ActionGetResponse, ActionPostRequest, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { log } from "console";
import idl from "../utils/affiliate_dapp.json" with { type: "json" };
import { Request, Response, Router } from "express";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
 import { AffiliateDapp } from "../utils/idl.js";
import dotenv from "dotenv";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
dotenv.config();

const blinkRouter = Router();

blinkRouter.get("/actions/affiliate-mint", async (req: any, res: any) => {
    const { title, campaign, influencer, nft } = req.query;
    const baseHref = `${req.protocol}://${req.get('host')}/api/actions/affiliate-mint?campaign=${campaign}&influencer=${influencer}&nft=${nft}&title=${title}`;
    try {
        const payload: ActionGetResponse = {
            icon: "https://tan-glamorous-whippet-563.mypinata.cloud/ipfs/bafybeicezmcam75wapdmwovw5ubdqdjds4qs5mkqrfhz4w3xlffjpmfwui",
            label: "Affiliate Mint",
            description: "Mint an NFT as part of an affiliate campaign",
            title: title ,
            links: {
                actions: [
                    {
                        type: "transaction",
                        href: baseHref,
                        label: "Mint NFT",
                    }
                ]
            }
        }
        res.json(payload);
    } catch (error) {
         res.status(500).json({ error: "Internal Server Error" });
    }

});


blinkRouter.get("/hello", async (_req: Request, res: Response) => {
    try {
        log("Hello endpoint hit");
        res.status(200).json({ message: "Hello, World!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});



blinkRouter.post('/actions/affiliate-mint', async (req: Request, res: any) => {

  try {
     console.log(req);
      const { campaign, influencer, nft } = req.query;
      // const body: ActionPostRequest = await req.();
       console.log("Request body:", req.body);
      
      const { account } = req.body;
          if (!campaign || !influencer || !nft) {
        return res.status(400).json({
          error: "Missing required parameters"
        });
      }
  
      if (!account) {
        return res.status(400).json({
          error: "Missing account in request body"
        });
      }
      const connection = new Connection(process.env.SOLANA_RPC_URL);

      const buyer = new PublicKey(account);
       const influencerKey = new PublicKey(influencer);
       const nftMint = new PublicKey(nft);
    
      const dummyWallet = {
        publicKey: new PublicKey(account),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      };
  
       const provider = new AnchorProvider(connection, dummyWallet, {});
       const program = new Program(idl as AffiliateDapp, provider);
       const programId = program.programId
      //   const [campaignPDA] = await PublicKey.findProgramAddressSync(
      //   [Buffer.from("nft_campaign"), Buffer.from(campaign as string), nftMint.toBuffer()],
      //   program.programId
      // );
  
      // const [affiliateLinkPDA] = await PublicKey.findProgramAddressSync(
      //   [Buffer.from("affiliate_link"), influencerKey.toBuffer(), Buffer.from(campaign as string)],
      //   program.programId
      // );
  
      // const [nftEscrowPDA] = await PublicKey.findProgramAddressSync(
      //   [Buffer.from("nft_escrow"), Buffer.from(campaign as string), nftMint.toBuffer()],
      //   program.programId
      // );
  
      // const buyerTokenAccount = await getAssociatedTokenAddress(nftMint, buyer);
      //  //const buyerTokenAccount = await getAssociatedTokenAddress(mintPubkey, buyer);
      // const ownerTokenAccount = await getAssociatedTokenAddress(nftMint, campaignPDA,true);
      // const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(nftMint, nftEscrowPDA, true);
  
      // const ix = await program.methods
      //   .processAffiliateMint(campaign, influencerKey, nftMint)
      //   .accounts({
      //     campaign: campaignPDA,
      //     affiliateLink: affiliateLinkPDA,
      //     buyer: buyer,
      //     owner: campaignPDA, // Replace with real owner if not the campaign
      //     influencer: influencerKey,
      //     nftMint: nftMint,
      //     nftEscrow: nftEscrowPDA,
      //     buyerTokenAccount,
      //     ownerTokenAccount,
      //     escrowPdaNftTokenAccount,
      //     marketplaceAuthority: campaignPDA, // Replace if different
      //     tokenProgram: TOKEN_PROGRAM_ID,
      //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .instruction();


    const [campaignPda] = await PublicKey.findProgramAddressSync(
    [Buffer.from("nft_campaign"), Buffer.from(campaign.toString()), nftMint.toBuffer()],
    programId
  );

  const [affiliateLinkPda] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from("affiliate_link"),
      influencerKey.toBuffer(),
      Buffer.from(campaign as String),
    ],
    programId
  );

  const nftEscrowPda = (
    await PublicKey.findProgramAddressSync(
      [Buffer.from("nft_escrow"), Buffer.from(campaign as String), nftMint.toBuffer()],
      programId
    )
  )[0];

  const buyerTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    buyer
  );

    const escrowPdaNftTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    nftEscrowPda,
    true, // allowOwnerOffCurve = true for PDA
    TOKEN_PROGRAM_ID
  );
  
   let [marketplaceAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace_authority")],
      program.programId
    );

    const ix =  await program.methods
    .processAffiliateMint(campaign as String, influencerKey,nftMint)
    .accounts({
      campaign: campaignPda,
      affiliateLink: affiliateLinkPda,
      buyer,
      influencer,
      nftMint,
      nftEscrow: nftEscrowPda,
      buyerTokenAccount,
      escrowPdaNftTokenAccount,
      marketplaceAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
      // Build transaction to return to client
      const latestBlockhash = await connection.getLatestBlockhash();
  
      const transaction = new Transaction({
       blockhash: latestBlockhash.blockhash,
       lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }).add(ix);
      console.log(transaction);
      
    transaction.feePayer = buyer;
    const serializedTransaction = transaction.serialize({
  requireAllSignatures: false,
  verifySignatures: false,
}).toString('base64');

    

    const payload = {
  transaction: serializedTransaction,
  message: `Affiliate mint transaction for campaign: ${campaign}`,
};
   res.json(payload);
  
  
  } catch (error) {
     console.error("Error processing affiliate mint:", error);
    
    // Provide more detailed error information
    const errorResponse = {
      error: "Failed to process affiliate mint transaction",
      message: error.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };

    return res.status(500).json(errorResponse);
  }

});

export default blinkRouter;
