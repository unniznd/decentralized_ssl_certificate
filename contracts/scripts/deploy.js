const main = async () => {

    const contractNames = [
        "DomainCertificate",  
    ];
  
    for(let i = 0; i<contractNames.length; i++){
        try {
            const contractFactory = await hre.ethers.getContractFactory(contractNames[i]);
            const _contract = await contractFactory.deploy();
            await _contract.waitForDeployment();
            console.log(`${contractNames[i]} contract deployed to: ${await _contract.getAddress()}`);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
  };
    
  main();