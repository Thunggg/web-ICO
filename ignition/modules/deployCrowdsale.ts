import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256 } from "ethers";

const DeployCrowdsaleModule = buildModule("DeployCrowdsaleModule", (m) => {
    const OCEAN_TOKEN_ADDRESS = "NEW_OCEAN_TOKEN_ADDRESS"; // Thay từ config
    const oceanToken = m.contractAt("OceanToken", OCEAN_TOKEN_ADDRESS);

    const crowdsale = m.contract("OceanCrowdsale", [
        1000,                 // ETH rate: 1 ETH = 1000 Ocean tokens
        1,                    // USDT rate: 1 USDT = 1 Ocean token
        "0x18904790e72A823c703dc43560f3b8A8626fC1a0",
        OCEAN_TOKEN_ADDRESS,
    ]);

    m.call(oceanToken, "grantRole", [
        keccak256(Buffer.from("MINTER_ROLE")),
        crowdsale
    ]);

    return { crowdsale };
});

export default DeployCrowdsaleModule;