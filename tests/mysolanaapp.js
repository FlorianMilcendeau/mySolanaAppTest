const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("mysolanaapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Mysolanaapp;

  it("Create a counter", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const count = account.count.toString();
    console.log("Count 1:", count);
    assert.ok(count === "0");
    _baseAccount = baseAccount;
  });

  it("Icrement a counter", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const count = account.count.toString();
    console.log("Count 2:", count);
    assert.ok(count === "1");
  });

  it("Get account", async () => {
    const baseAccount = _baseAccount;

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const count = account.count.toString();
    console.log("Count 2:", count);
    assert.ok(count === "1");
  });
});
