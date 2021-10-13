const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("mysolanaapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Mysolanaapp;

  it("Create Account", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.initialize("Hello world", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const { data, dataList } = account;

    assert.strictEqual(data, "Hello world");
    assert.ok(dataList.length === 1);
    assert.strictEqual(dataList[0], "Hello world");
    _baseAccount = baseAccount;
  });

  it("Update account's data", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.update("New data", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const { data, dataList } = account;

    assert.strictEqual(data, "New data");
    assert.ok(dataList.length === 2);
    assert.strictEqual(dataList[0], "Hello world");
    assert.strictEqual(dataList[1], "New data");
  });

  it("Get account", async () => {
    const baseAccount = _baseAccount;

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    const { data, dataList } = account;

    assert.strictEqual(data, "New data");
    assert.ok(dataList.length === 2);
    assert.strictEqual(dataList[0], "Hello world");
    assert.strictEqual(dataList[1], "New data");
  });
});
