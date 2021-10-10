import { web3, Provider, Idl, Program } from "@project-serum/anchor";
import { Commitment, ConfirmOptions, Connection, ConnectionConfig, Keypair, PublicKey } from "@solana/web3.js";
import type { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
import type { IdlTypes, TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import type { WalletContextState } from "@solana/wallet-adapter-react";

const { SystemProgram } = web3;

export const getProvider = async (
  network: string,
  wallet: WalletContextState,
  config: Commitment | ConnectionConfig | ConfirmOptions
): Promise<Provider> => {
  const connection = new Connection(network, config);
  const provider = new Provider(connection, wallet as any, config as ConfirmOptions);

  return provider;
};

export const getCounter = async (
  idl: Idl,
  programID: PublicKey,
  secretKeyPair: Keypair,
  provider: Provider
): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> => {
  const program = new Program(idl, programID, provider);
  try {
    const account = await program.account.baseAccount.fetch(secretKeyPair.publicKey);
    return account;
  } catch (error) {
    console.error("Transaction error:", error);
  }
};

export const createCounter = async (
  idl: Idl,
  programID: PublicKey,
  secretKeyPair: Keypair,
  provider: Provider
): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> => {
  const program = new Program(idl, programID, provider);

  try {
    await program.rpc.create({
      accounts: {
        baseAccount: secretKeyPair.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [secretKeyPair],
    });

    const account = await program.account.baseAccount.fetch(secretKeyPair.publicKey);
    return account;
  } catch (error) {
    console.error("Transaction error:", error);
  }
};

export const incrementCounter = async (
  idl: Idl,
  programID: PublicKey,
  secretKeyPair: Keypair,
  provider: Provider
): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> => {
  const program = new Program(idl as Idl, programID, provider);

  try {
    await program.rpc.increment({
      accounts: {
        baseAccount: secretKeyPair.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(secretKeyPair.publicKey);
    return account;
  } catch (error) {
    console.error("Transaction error:", error);
  }
};
