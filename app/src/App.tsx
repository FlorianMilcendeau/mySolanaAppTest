import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Idl, web3 } from "@project-serum/anchor";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import idl from "./config/idl.json";
import kp from "./config/keypair.json";
import { createCounter, getCounter, getProvider, incrementCounter } from "./services/Account";
import "./App.css";

const wallets = [getPhantomWallet()];

const opts = {
  preflightCommitment: "processed" as const,
};
const programID = new PublicKey(idl.metadata.address);
const network = "http://127.0.0.1:8899";

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const secretPair = web3.Keypair.fromSecretKey(secret);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  const getAccount = async (): Promise<void> => {
    const provider = await getProvider(network, wallet, opts.preflightCommitment);
    const account = await getCounter(idl as Idl, programID, secretPair, provider);

    if (account) {
      console.log("account: ", account);
      setValue(account.count.toString());
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const create = async (): Promise<void> => {
    const provider = await getProvider(network, wallet, opts.preflightCommitment);
    const account = await createCounter(idl as Idl, programID, secretPair, provider);

    if (account) {
      console.log("account: ", account);
      setValue(account.count.toString());
    }
  };

  const increment = async (): Promise<void> => {
    const provider = await getProvider(network, wallet, opts.preflightCommitment);
    const account = await incrementCounter(idl as Idl, programID, secretPair, provider);

    if (account) {
      console.log("Account:", account);
      setValue(account.count.toString());
    }
  };

  return !(wallet as any).connected ? (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <WalletMultiButton />
    </div>
  ) : (
    <div className="App">
      <div>
        {!value ? (
          <button onClick={create}>Create a counter</button>
        ) : (
          <button onClick={increment}>Icrement the counter</button>
        )}
        {value && value > Number(0) ? <h2>{value}</h2> : <h3>Please create a counter</h3>}
      </div>
    </div>
  );
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default AppWithProvider;
