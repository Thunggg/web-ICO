import fs from 'fs';
import { existsSync } from 'fs';
import path from 'path';

// Định nghĩa interface cho deployed addresses
interface DeployedAddresses {
  [key: string]: string;
}

// Sửa đường dẫn - từ script/ folder lên root
const deployedAddressesPath = path.join(__dirname, '../ignition/deployments/chain-11155111/deployed_addresses.json');
const configPath = path.join(__dirname, '../config.json');

let deployedAddresses: DeployedAddresses = {};

if (existsSync(deployedAddressesPath)) {
  deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));
} else {
  console.error('Deployed addresses file not found at:', deployedAddressesPath);
  console.error('Please deploy contracts first.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Kiểm tra xem addresses có tồn tại không trước khi assign
const oceanTokenAddress = deployedAddresses['DeployAllModule#OceanToken'];
const vaultAddress = deployedAddresses['DeployAllModule#Vault'];

if (!oceanTokenAddress || !vaultAddress) {
  console.error('Deployed addresses not found. Please deploy contracts first.');
  console.error('Available keys:', Object.keys(deployedAddresses));
  process.exit(1);
}

config.ethtest = {
  OceanToken: oceanTokenAddress,
  Vault: vaultAddress
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Config updated successfully!');
console.log('Updated config.json with:');
console.log('- OceanToken:', oceanTokenAddress);
console.log('- Vault:', vaultAddress);