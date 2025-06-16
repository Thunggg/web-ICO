"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { sepolia } from "@reown/appkit/networks";

// 1. Get projectId at https://cloud.reown.com
const projectId = "a32e8efceecf6166fb131c0d3cf82ebe";

// 2. Create a metadata object
const metadata = {
    name: "Ocean ICO",
    description: "Ocean Token ICO Platform",
    url: "http://localhost:3000/", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
createAppKit({
    adapters: [new Ethers5Adapter()],
    metadata: metadata,
    networks: [sepolia], // Chỉ sử dụng Sepolia testnet
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});

export function AppKit({ children }: { children: React.ReactNode }) {
    return children;
}