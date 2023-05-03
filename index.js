// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key array here
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

    const from_balance= await connection.getBalance(from.publicKey);
    const to_balance=await connection.getBalance(to.publicKey);
    console.log(`From Wallet balance before transaction is ${from_balance/10 ** 9}`);
    console.log(`To Wallet balance before transaction is ${to_balance/10 ** 9}`);



    // // Aidrop 2 SOL to Sender wallet
    // console.log("Airdopping some SOL to Sender wallet!");
    // try {
    //         const fromAirDropSignature = await connection.requestAirdrop(
    //             new PublicKey(from.publicKey),
    //             2 * LAMPORTS_PER_SOL
    //         );

    //          // Latest blockhash (unique identifer of the block) of the cluster
    // let latestBlockHash = await connection.getLatestBlockhash();

    // // Confirm transaction using the last valid block height (refers to its time)
    // // to check for transaction expiration
    // await connection.confirmTransaction({
    //     blockhash: latestBlockHash.blockhash,
    //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //     signature: fromAirDropSignature
    // });

    // console.log("Airdrop completed for the Sender account");


    // } catch (error) {
    //     console.log(error)
    // }

    // Send money from "from" wallet and into "to" wallet
    const transfer_amount=Math.floor(from_balance/2);
    console.log(`Sending ${transfer_amount/10**9} SOL from FROM wallet to TO wallet`)
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: transfer_amount
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);
    
    const from_balance_after =await connection.getBalance(from.publicKey)
    const to_balance_after=await connection.getBalance(to.publicKey);
    console.log(`From wallet balance after transcation is ${from_balance_after/10 ** 9}`);
    console.log(`To Wallet balance after transcation is ${to_balance_after/10 ** 9}`);
}

transferSol();