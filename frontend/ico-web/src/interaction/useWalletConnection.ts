"use client";

import { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';

export function useWalletConnection() {
    const { address, isConnected, status } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initProvider = async () => {
            if (walletProvider && isConnected) {
                try {
                    setIsLoading(true);
                    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
                    setProvider(ethersProvider);
                } catch (error) {
                    console.error('Error initializing provider:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setProvider(null);
            }
        };

        initProvider();
    }, [walletProvider, isConnected]);

    const getSigner = async () => {
        if (!provider) throw new Error('Provider not available');
        return provider.getSigner();
    };

    return {
        address,
        isConnected,
        provider,
        getSigner,
        isLoading,
        status
    };
}