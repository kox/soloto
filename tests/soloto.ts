import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Soloto } from "../target/types/soloto";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { assert } from 'chai';

describe("soloto", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Soloto as Program<Soloto>;
  const programId = program.programId;

  const payer = provider.wallet as anchor.Wallet;

  it("Is initialized!", async () => {
    const [solotoPda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("soloto")],
      program.programId
    );

    console.log(solotoPda, bump);

    const tx = await program.methods
      .initialize()
      .accounts({
        soloto: solotoPda,
        signer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature", tx);
    console.log(solotoPda);

    const account = await program.account.soloto.fetch(solotoPda);

    assert.ok(account.winner.equals(PublicKey.default));
    assert.equal(account.players.length, 0);
    assert.equal(account.ticketsCounter.toNumber(), 0);
    assert.equal(account.bumpCounter, bump);
  });

  /* it('Adds a ticket and processes payout', async () => { */
    // Generate keypairs for the soloto account and the buyer
    /* const soloto = anchor.web3.Keypair.generate();
    const buyer = anchor.web3.Keypair.generate();

    // Get the PDA and bump for the soloto account
    const [solotoPda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("soloto")],
      program.programId
    ); */

    // Fund the signer account
    /* await provider.connection.requestAirdrop(soloto.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(soloto.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    ); */

    /* const buyer = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(provider.wallet.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    ); */

    /* const [solotoPda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("soloto")],
      program.programId
    );

    console.log(solotoPda, bump);

    const tx = await program.methods
      .initialize()
      .accounts({
        soloto: solotoPda,
        signer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature", tx);
    console.log(solotoPda);

    const account = await program.account.soloto.fetch(solotoPda);

    assert.ok(account.winner.equals(PublicKey.default));
    assert.equal(account.players.length, 0);
    assert.equal(account.ticketsCounter.toNumber(), 0);
    assert.equal(account.bumpCounter, bump);
 */
    /* const tx = await program.methods
      .initialize()
      .accounts({
        soloto: solotoPda,
        signer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc(); */

    

    // Perform the initialization transaction
    /* await program.methods.initialize()
      .accounts({
        soloto: solotoPda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Fetch the account details after initialization
    let account = await program.account.soloto.fetch(solotoPda);
    assert.ok(account.winner.equals(PublicKey.default));
    assert.equal(account.players.length, 0);
    assert.equal(account.ticketsCounter.toNumber(), 0);
    assert.equal(account.bumpCounter, bump); */

    // Simulate buying a ticket
    /* await program.methods.addTicketOrPayout()
      .accounts({
        soloto: solotoPda,
        buyer: buyer.publicKey,
        solotoAcc: solotoPda,
        winner: PublicKey.default,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    // Fetch the account details after buying a ticket
    account = await program.account.soloto.fetch(solotoPda);
    assert.equal(account.players.length, 1);
    assert.ok(account.players[0].equals(buyer.publicKey));
    assert.equal(account.ticketsCounter.toNumber(), 1);

    // Simulate the passage of time and trigger the payout
    const clock = await provider.connection.getAccountInfo(anchor.web3.SYSVAR_CLOCK_PUBKEY);
    const currentTime = anchor.BN.fromBuffer(clock.data.slice(8, 16), "le");
    await program.methods.addTicketOrPayout()
      .accounts({
        soloto: solotoPda,
        buyer: buyer.publicKey,
        solotoAcc: solotoPda,
        winner: PublicKey.default,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    // Fetch the account details after payout
    account = await program.account.soloto.fetch(solotoPda);
    assert.ok(!account.winner.equals(PublicKey.default));
    assert.equal(account.players.length, 0);
    assert.equal(account.ticketsCounter.toNumber(), 0); */
  /* }); */

});
