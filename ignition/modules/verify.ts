import fs from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Định nghĩa interface cho deployed addresses
interface DeployedAddresses {
  [key: string]: string;
}

// Đường dẫn đến file deployed addresses
const deployedAddressesPath = path.join(__dirname, '../deployments/chain-11155111/deployed_addresses.json');

async function verifyContracts() {
  // Kiểm tra file deployed addresses có tồn tại không
  if (!existsSync(deployedAddressesPath)) {
    console.error('❌ Deployed addresses file not found at:', deployedAddressesPath);
    console.error('Please deploy contracts first.');
    process.exit(1);
  }

  // Đọc deployed addresses
  const deployedAddresses: DeployedAddresses = JSON.parse(
    fs.readFileSync(deployedAddressesPath, 'utf8')
  );

  const oceanTokenAddress = deployedAddresses['DeployAllModule#OceanToken'];
  const vaultAddress = deployedAddresses['DeployAllModule#Vault'];

  if (!oceanTokenAddress || !vaultAddress) {
    console.error('❌ Contract addresses not found in deployed addresses');
    console.error('Available keys:', Object.keys(deployedAddresses));
    process.exit(1);
  }

  console.log('🔍 Starting contract verification...');
  console.log('📍 OceanToken address:', oceanTokenAddress);
  console.log('📍 Vault address:', vaultAddress);

  try {
    // Verify OceanToken
    console.log('\n🔍 Verifying OceanToken...');
    const oceanTokenCmd = `npx hardhat verify --network sepolia ${oceanTokenAddress} 100000000 50`;
    console.log('Command:', oceanTokenCmd);
    
    const { stdout: oceanStdout, stderr: oceanStderr } = await execAsync(oceanTokenCmd);
    
    if (oceanStderr && !oceanStderr.includes('Already Verified')) {
      console.error('❌ OceanToken verification failed:', oceanStderr);
    } else {
      console.log('✅ OceanToken verified successfully!');
      if (oceanStdout) console.log(oceanStdout);
    }

    // Verify Vault
    console.log('\n🔍 Verifying Vault...');
    const vaultCmd = `npx hardhat verify --network sepolia ${vaultAddress}`;
    console.log('Command:', vaultCmd);
    
    const { stdout: vaultStdout, stderr: vaultStderr } = await execAsync(vaultCmd);
    
    if (vaultStderr && !vaultStderr.includes('Already Verified')) {
      console.error('❌ Vault verification failed:', vaultStderr);
    } else {
      console.log('✅ Vault verified successfully!');
      if (vaultStdout) console.log(vaultStdout);
    }

    console.log('\n🎉 Verification completed!');
    console.log('🔗 View on Etherscan:');
    console.log(`   - OceanToken: https://sepolia.etherscan.io/address/${oceanTokenAddress}`);
    console.log(`   - Vault: https://sepolia.etherscan.io/address/${vaultAddress}`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// Chạy verification
verifyContracts().catch(console.error);