import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployAllModule = buildModule("DeployAllModule", (m) => {
  // Deploy OceanToken first
  const oceanToken = m.contract("OceanToken", [100000000, 50]);
  
  // Deploy Vault (constructor không cần parameters)
  const vault = m.contract("Vault");
  
  // Set token cho vault sau khi deploy (optional - có thể làm manual)
  // m.call(vault, "setToken", [oceanToken]);
  
  return { oceanToken, vault };
});

export default DeployAllModule;