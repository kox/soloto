import { FC, useEffect, useState } from "react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  setProvider,
  Wallet,
} from "@coral-xyz/anchor";

import idl from "../../anchor/soloto.json";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Soloto as SolotoType } from "./soloto";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

console.log(programID);

const SolotoInitialize: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [solotos, setSolotos] = useState([]);

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet as unknown as Wallet,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  const initialize = async () => {
    try {
      const anchProvider = getProvider();
      const program = new Program<SolotoType>(idl_object, anchProvider);
      
      const [solotoPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("soloto")],
        program.programId
    );

    console.log(solotoPDA.toString());

    const tx = await program.methods
        .initialize()
        .accounts({
          soloto: solotoPDA,
          user: anchProvider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Soloto was initialized");
      console.log("Transaction signature", tx);
      
    } catch (error) {
      console.error("Error while initializing a soloto: " + error);
    }
  };

  return (
    <div>
      <h1>Hello, Solana!</h1>
      <button onClick={initialize}>Initialize</button>
    </div>
  );
};

export default SolotoInitialize;
