import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployUSDTModule = buildModule("DeployUSDTModule", (m) => {
  const usdt = m.contract("USDT", [100000000, 50]); // cap: 100M, reward: 50
  return { usdt };
});

export default DeployUSDTModule;