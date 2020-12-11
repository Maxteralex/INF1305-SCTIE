'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  try {

    // Parse the connection profile. This would be the path to the file downloaded
    // from the IBM Blockchain Platform operational console.
    const ccpPath = path.resolve(__dirname, '..', '..', 'SistemaDeTrocaInterEmpresas', 'profiles', 'RedeProfiles.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Configure a wallet. This wallet must already be primed with an identity that
    // the application can use to interact with the peer node.
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway, and connect to the gateway peer node(s). The identity
    // specified must already exist in the specified wallet.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1' , discovery: {enabled: true, asLocalhost:false }});

    // Get the network channel that the smart contract is deployed to.
    const network = await gateway.getNetwork('ca');

    // Get the smart contract from the network channel.
    const contract = network.getContract('AtivoTroca');

    // Submit the 'createCar' transaction to the smart contract, and wait for it
    // to be committed to the ledger.
    await contract.submitTransaction("createAtivoTroca", "001", "Americanas", "Loja Genérica", 5, "Barra de Chocolate", 25, "23/12/2020");
    console.log('Transaction has been submitted');

    await gateway.disconnect();

    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      process.exit(1);
    }
  }
main();