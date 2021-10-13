import { web3, Provider, Idl, Program } from "@project-serum/anchor";
import { Commitment, ConfirmOptions, Connection, ConnectionConfig, Keypair, PublicKey } from "@solana/web3.js";
import type { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
import type { IdlTypes, TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import type { WalletContextState } from "@solana/wallet-adapter-react";

const { SystemProgram } = web3;

export interface IAccount {
  data: null | string;
  dataList: null | string[];
}

export const getProvider = (
  network: string,
  wallet: WalletContextState,
  config: Commitment | ConnectionConfig | ConfirmOptions
): Provider => {
  const connection = new Connection(network, config);
  const provider = new Provider(connection, wallet as any, config as ConfirmOptions);

  return provider;
};

class Account {
  private secretKeyPair: Keypair;

  private provider: Provider;

  private program: Program;

  constructor(idl: Idl, programID: PublicKey, secretKeyPair: Keypair, provider: Provider) {
    this.secretKeyPair = secretKeyPair;
    this.provider = provider;

    this.program = new Program(idl, programID, provider);
  }

  /**
   * getCounter
   */
  public async getAccount(): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> {
    try {
      const account = await this.program.account.baseAccount.fetch(this.secretKeyPair.publicKey);
      return account;
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }

  /**
   * Initialize account
   */
  public async initialize(data: string): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> {
    try {
      await this.program.rpc.initialize(data, {
        accounts: {
          baseAccount: this.secretKeyPair.publicKey,
          user: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [this.secretKeyPair],
      });

      const account = await this.program.account.baseAccount.fetch(this.secretKeyPair.publicKey);
      return account;
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }

  /**
   * update data account
   */
  public async update(data: string): Promise<TypeDef<IdlTypeDef, IdlTypes<Idl>> | undefined> {
    try {
      await this.program.rpc.update(data, {
        accounts: {
          baseAccount: this.secretKeyPair.publicKey,
        },
      });

      const account = await this.program.account.baseAccount.fetch(this.secretKeyPair.publicKey);
      return account;
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }
}

export default Account;
