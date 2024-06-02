'use client';

import AppWalletProvider from "./components/AppWalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import idl from '../anchor/soloto.json'; // Ensure you have the IDL file for your program
import SolotoInitialize from "./components/SolotoInitialize";


export default function Home() {
  /* const [provider, setProvider] = useState(null);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const setup = async () => {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'https://api.devnet.solana.com';
      const connection = new Connection(network, 'processed');

      const wallet = new web3.Wallet();
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
      });
      setProvider(provider);

      const programId = new PublicKey(idl.metadata.address);
      const program = new Program(idl, programId, provider);
      setProgram(program);
    };

    setup();
  }, []);

  const initialize = async () => {
    if (program) {
      await program.rpc.initialize({
        accounts: {
          soloto: new PublicKey(),
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      });
    }
  }; */

  return (
    <AppWalletProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Welcome to SOLOTO Solana APP
          </p>
          {/* <button onClick={initialize}>Initialize</button> */}
          <WalletMultiButton />
        </div>

        <SolotoInitialize />
      </main>
    </AppWalletProvider>
  );
}
