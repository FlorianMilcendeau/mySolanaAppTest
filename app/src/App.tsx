import { ChangeEvent, useEffect, useState } from "react";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { v4 as uuidV4 } from "uuid";

import "./App.css";
import useAccount from "./hooks/account";
import { NETWORK } from "./contantes";
import { IAccount } from "./services/account";

const wallets = [getPhantomWallet()];

function App() {
  const [value, setValue] = useState<IAccount>({ data: null, dataList: null });
  const [form, setForm] = useState<string>("");
  const wallet = useWallet();
  const { Account } = useAccount(wallet);

  console.log(value);

  const getAccount = async (): Promise<void> => {
    const account = await Account.getAccount();

    if (account && account.dataList.length) {
      setValue({ data: account.data, dataList: account.dataList });
    }
  };

  useEffect(() => {
    if (Account && wallet.connected) {
      getAccount();
    }
  }, [wallet.connected]);

  const initialize = async (data: string): Promise<void> => {
    const account = await Account.initialize(data);

    if (account) {
      setValue({ data: account.data, dataList: account.dataList });
    }
  };

  const update = async (data: string): Promise<void> => {
    const account = await Account.update(data);

    if (account) {
      setValue({ data: account.data, dataList: account.dataList });
    }
  };

  return !wallet.connected ? (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <WalletMultiButton />
    </div>
  ) : (
    <div className="App">
      <div>
        <input onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(e.target.value)} />
        {!value.data ? (
          <button onClick={() => initialize(form)}>Create account</button>
        ) : (
          <button onClick={() => update(form)}>Update account</button>
        )}
      </div>
      {value.dataList ? (
        <>
          <h3>{value.data}</h3>
          <ul>
            {value.dataList &&
              value.dataList.length &&
              value.dataList.map((item: string) => <li key={uuidV4()}>{item}</li>)}
          </ul>
        </>
      ) : (
        <h3>Please create account</h3>
      )}
    </div>
  );
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint={NETWORK}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default AppWithProvider;
