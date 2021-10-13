import { PublicKey } from "@solana/web3.js";
import { Idl, web3 } from "@project-serum/anchor";
import type { WalletContextState } from "@solana/wallet-adapter-react";

import idl from "../config/idl.json";
import kp from "../config/keypair.json";
import Account, { getProvider } from "../services/account";
import { NETWORK } from "../contantes";

const opts = {
  preflightCommitment: "processed" as const,
};
const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const secretPair = web3.Keypair.fromSecretKey(secret);

const useAccount = (wallet: WalletContextState) => {
  const provider = getProvider(NETWORK, wallet, opts.preflightCommitment);
  const account: Account = new Account(idl as Idl, programID, secretPair, provider);

  return {
    Account: account,
  };
};

export default useAccount;
