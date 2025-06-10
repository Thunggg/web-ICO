import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployOceanTokenModule = buildModule("DeployAllModule", (m) => {
  const oceanToken = m.contract("OceanToken", [100000000, 50]);
  return { oceanToken };
});

export default DeployOceanTokenModule;