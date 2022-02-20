import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { VotingContract } from '../target/types/voting_contract';
const assert = require("assert");
const { SystemProgram } = anchor.web3;

describe('voting-contract', () => {
  /* create and set a Provider */
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.VotingContract;
  let _baseAccount;
  it("Creates a proposal", async () => {
    /* Call the create function via RPC */
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.createproposal({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Vote Count: ', account.count.toString())
    assert.ok(account.count.toString() == 0);
    _baseAccount = baseAccount;

  });

  it("Vote for a proposal", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.vote({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Vote Count: ', account.count.toString())
    assert.ok(account.count.toString() == 1);
  });
});
