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

    console.log("Verifying USDT...");
    try {
        await run("verify:verify", {
            address: contracts.USDT,
            constructorArguments: [100000000, 50],
        });
    } catch (e) {
        console.log("Error verifying USDT:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });