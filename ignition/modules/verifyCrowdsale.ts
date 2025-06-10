import { run } from "hardhat";
import config from "../../config.json";

interface NetworkConfig {
    OceanToken?: string;
    Vault?: string;
    USDT?: string;
    Crowdsale?: string;
}

async function main() {
    const network = "ethtest";
    const contracts = config[network as keyof typeof config] as NetworkConfig;

    console.log("Verifying OceanCrowdsale...");
    try {
        await run("verify:verify", {
            address: contracts.Crowdsale,
            constructorArguments: [
                1000,
                1,
                "0x18904790e72A823c703dc43560f3b8A8626fC1a0",
                contracts.OceanToken
            ],
        });
    } catch (e) {
        console.log("Error verifying OceanCrowdsale:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });