import { ApiPromise, WsProvider } from '@polkadot/api';

import { Keyring } from '@polkadot/keyring';

// 创建 api 对象
const wsProvider = new WsProvider('ws://localhost:9944');
const api = await ApiPromise.create({ provider: wsProvider });

const keyring = new Keyring({type:'sr25519'})
const alice = keyring.addFromUri('//Alice');
const bob = keyring.addFromUri('//Bob');

// Make a transfer from Alice to BOB, waiting for inclusion
const unsub = await api.tx.balances
  .transfer(bob.address, 12345)
  .signAndSend(alice, (result) => {
    console.log(`Current status is ${result.status}`);

    if (result.status.isInBlock) {
      console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
    } else if (result.status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
      unsub();
    }
  });
  
  const subscribeAliceBalance = await api.query.system.account(alice.address, result =>{
	  const aliceBalance = result.data.free;
	  console.log(`Alice account: ${aliceBalance}`);
  })