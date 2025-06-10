import { run } from "hardhat";
import config from "../../config.json";

interface NetworkConfig {
    OceanToken?: string;
    Vault?: string;
    USDT?: string;
    Crowdsale?: string;
}

async function main() {
    // Lấy tên network từ biến môi trường hoặc mặc định là "ethtest"
    const network = "ethtest";
    
    // Lấy địa chỉ các contract đã deploy từ config theo network
    const contracts = config[network as keyof typeof config] as NetworkConfig;

    console.log("Verifying OceanToken...");
    try {
        // Chạy task verify của hardhat
        await run("verify:verify", {
            address: contracts.OceanToken,     // Địa chỉ contract cần verify
            constructorArguments: [100000000, 50], // Các tham số đã dùng khi deploy
            // 100000000: cap (giới hạn tổng cung)
            // 50: block reward
        });
    } catch (e) {
        console.log("Error verifying OceanToken:", e);
    }
}

// Chạy hàm main và xử lý kết quả
main()
    .then(() => process.exit(0))    // Thoát với code 0 nếu thành công
    .catch((error) => {            // Bắt và in lỗi nếu có
        console.error(error);
        process.exit(1);           // Thoát với code 1 nếu có lỗi
    });