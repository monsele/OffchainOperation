import { ActionGetResponse, ActionPostRequest, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { log } from "console";
import idl from "../utils/affiliate_dapp.json" with { type: "json" };
import { Request, Response, Router } from "express";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
 import { AffiliateDapp } from "../utils/idl.js";
import dotenv from "dotenv";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
dotenv.config();

const blinkRouter = Router();

blinkRouter.get("/actions/affiliate-mint", async (req: any, res: any) => {

    const { owner, campaign, influencer, nft } = req.query;
    const nftMint = new PublicKey(nft);
     const connection = new Connection("https://devnet.helius-rpc.com/?api-key=8eb94de2-b378-4923-a86f-10d7590b4fdd");
    const metaplex = new Metaplex(connection);
     const nftJson = await metaplex.nfts().findByMint({ mintAddress: nftMint });
      const uri = nftJson.uri.startsWith('ipfs://')
    ? nftJson.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : nftJson.uri;
     let metaData = await fetch(uri || '');
     let metaDataJson = await metaData.json() as { image?: string; [key: string]: any };
    const baseHref = `${req.protocol}://${req.get('host')}/api/actions/affiliate-mint?campaign=${campaign}&influencer=${influencer}&nft=${nft}&owner=${owner}`;
    try {
        const payload: ActionGetResponse = {
            icon: metaDataJson.image ||"https://tan-glamorous-whippet-563.mypinata.cloud/ipfs/bafybeicezmcam75wapdmwovwubdqdjds4qs5mkqrfhz4w3xlffjpmfwui",
            label: "Affiliate Mint",
            description: "Mint an NFT as part of an affiliate campaign",
            title: "Minting an NFT",
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
    console.log("----- New Request Received -----");
    console.log("Request URL:", req.url);
    console.log("Request Query:", req.query);
    console.log("Request Body:", req.body);
      const { campaign, influencer, nft, owner } = req.query;
      // const body: ActionPostRequest = await req.();
       
      
      const { account } = req.body;
          if (!campaign || !influencer || !nft || !owner) {
        return res.status(400).json({
          error: "Missing required parameters"
        });
      }
  
      if (!account) {
        return res.status(400).json({
          error: "Missing account in request body"
        });
      }
      const connection = new Connection("https://devnet.helius-rpc.com/?api-key=8eb94de2-b378-4923-a86f-10d7590b4fdd");

      const buyer = new PublicKey(account);
       const influencerKey = new PublicKey(influencer);
       const nftMint = new PublicKey(nft);
       const ownerKey = new PublicKey(owner)  // Use buyer as default if owner is not provided
      const dummyWallet = {
        publicKey: new PublicKey(account),
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      };
  
       const provider = new AnchorProvider(connection, dummyWallet, {});
       const program = new Program(idl as AffiliateDapp, provider);
       const programId = program.programId
     


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
     const accountsForInstruction = {
      campaign: campaignPda,
      affiliateLink: affiliateLinkPda,
      buyer,
      owner: ownerKey,
      influencer: influencerKey, // This is the corrected line
      nftMint,
      nftEscrow: nftEscrowPda,
      buyerTokenAccount,
      escrowPdaNftTokenAccount,
      marketplaceAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    };
    console.log("Accounts for instruction:", accountsForInstruction);
    
    const ix =  await program.methods
    .processAffiliateMint(campaign as String, influencerKey,nftMint)
    .accounts(accountsForInstruction)
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

blinkRouter.get("/nft-image", async (req: any, res: any) => {
    try {
        const { nftMint } = req.query;
        
        if (!nftMint) {
            return res.status(400).json({ error: "nftMint parameter is required" });
        }

        const connection = new Connection("https://devnet.helius-rpc.com/?api-key=8eb94de2-b378-4923-a86f-10d7590b4fdd");
        const metaplex = new Metaplex(connection);
        
        const nftPubkey = new PublicKey(nftMint as string);
        const nft = await metaplex.nfts().findByMint({ mintAddress: nftPubkey });

        if (!nft) {
            return res.status(404).json({ error: "NFT not found" });
        }

        if (!nft.json?.image) {
            return res.status(404).json({ error: "NFT image not found" });
        }

        return res.json({
            success: true,
            image: nft.json.image,
            name: nft.json.name,
            description: nft.json.description,
            attributes: nft.json.attributes
        });

    } catch (error: any) {
        console.error("Error fetching NFT:", error);
        return res.status(500).json({ 
            error: "Failed to fetch NFT",
            details: error.message 
        });
    }
});

export default blinkRouter;
