"use client";

import { useState, useEffect, useCallback } from 'react';
import { Contract, ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { CONTRACTS, CROWDSALE_ABI, OCEAN_TOKEN_ABI, USDT_ABI } from '@/constants/contract';
import { toaster } from '@/components/ui/toaster';

export function useOceanICO() {
    const { provider, getSigner, isConnected, address } = useWalletConnection();

    const [ethRate, setEthRate] = useState<number>(0);
    const [usdtRate, setUsdtRate] = useState<number>(0);
    const [oceanBalance, setOceanBalance] = useState<string>('0');
    const [usdtBalance, setUsdtBalance] = useState<string>('0');
    const [ethBalance, setEthBalance] = useState<string>('0');
    const [loadingStates, setLoadingStates] = useState({
        buyingETH: false,
        buyingUSDT: false,
        approving: false,
        calculating: false
    });

    // Get contract instances
    const getCrowdsaleContract = useCallback(async (needsSigner = false) => {
        if (!provider) throw new Error('Provider not available');

        if (needsSigner) {
            const signer = await getSigner();
            return new Contract(CONTRACTS.CROWDSALE, CROWDSALE_ABI, signer);
        }
        return new Contract(CONTRACTS.CROWDSALE, CROWDSALE_ABI, provider);
    }, [provider, getSigner]);

    // Get OCEAN token contract
    const getOceanContract = useCallback(async (needsSigner = false) => {
        if (!provider) throw new Error('Provider not available');

        if (needsSigner) {
            const signer = await getSigner();
            return new Contract(CONTRACTS.OCEAN_TOKEN, OCEAN_TOKEN_ABI, signer);
        }
        return new Contract(CONTRACTS.OCEAN_TOKEN, OCEAN_TOKEN_ABI, provider);
    }, [provider, getSigner]);

    // Get USDT token contract
    const getUSDTContract = useCallback(async (needsSigner = false) => {
        if (!provider) throw new Error('Provider not available');

        if (needsSigner) {
            const signer = await getSigner();
            return new Contract(CONTRACTS.USDT, USDT_ABI, signer);
        }
        return new Contract(CONTRACTS.USDT, USDT_ABI, provider);
    }, [provider, getSigner]);

    // Fetch exchange rates from contract
    const fetchRates = useCallback(async () => {
        try {
            const contract = await getCrowdsaleContract();
            const [ethRateResult, usdtRateResult] = await Promise.all([
                contract.ETH_rate(),
                contract.USDT_rate()
            ]);

            setEthRate(Number(ethRateResult));
            setUsdtRate(Number(usdtRateResult));
        } catch (error) {
            console.error('Error fetching rates:', error);
        }
    }, [getCrowdsaleContract]);

    // Fetch user balances
    const fetchBalances = useCallback(async () => {
        if (!address || !provider) return;

        try {
            const [oceanContract, usdtContract] = await Promise.all([
                getOceanContract(),
                getUSDTContract()
            ]);

            const [oceanBal, usdtBal, ethBal] = await Promise.all([
                oceanContract.balanceOf(address),
                usdtContract.balanceOf(address),
                provider.getBalance(address)
            ]);

            setOceanBalance(ethers.utils.formatUnits(oceanBal, 18));
            setUsdtBalance(ethers.utils.formatUnits(usdtBal, 18));
            setEthBalance(ethers.utils.formatEther(ethBal));
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    }, [address, provider, getOceanContract, getUSDTContract]);

    // Calculate token amount for ETH
    const calculateTokensFromETH = useCallback(async (ethAmount: string): Promise<string> => {
        try {
            if (!ethAmount || parseFloat(ethAmount) <= 0) return '0';

            const contract = await getCrowdsaleContract();
            const ethInWei = ethers.utils.parseEther(ethAmount);
            const tokenAmount = await contract.getTokenAmountETH(ethInWei);
            return ethers.utils.formatUnits(tokenAmount, 18);
        } catch (error) {
            console.error('Error calculating tokens from ETH:', error);
            return '0';
        }
    }, [getCrowdsaleContract]);

    // Calculate token amount for USDT
    const calculateTokensFromUSDT = useCallback(async (usdtAmount: string): Promise<string> => {
        try {
            if (!usdtAmount || parseFloat(usdtAmount) <= 0) return '0';

            const contract = await getCrowdsaleContract();
            const usdtInWei = ethers.utils.parseUnits(usdtAmount, 18);
            const tokenAmount = await contract.getTokenAmountUSDT(usdtInWei);
            return ethers.utils.formatUnits(tokenAmount, 18);
        } catch (error) {
            console.error('Error calculating tokens from USDT:', error);
            return '0';
        }
    }, [getCrowdsaleContract]);

    // Buy tokens with ETH
    const buyWithETH = useCallback(async (ethAmount: string) => {
        if (!isConnected || !address) {
            toaster.create({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, buyingETH: true }));
            const contract = await getCrowdsaleContract(true);
            const ethInWei = ethers.utils.parseEther(ethAmount);

            const tx = await contract.buyTokenByETH({ value: ethInWei });

            toaster.create({
                title: "Transaction sent",
                description: "Please wait for confirmation...",
                type: "info",
                duration: 5000,
            });

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                toaster.create({
                    title: "Purchase successful!",
                    description: `You bought OCEAN tokens with ${ethAmount} ETH`,
                    type: "success",
                    duration: 5000,
                });

                // Refresh balances
                await fetchBalances();
            } else {
                throw new Error('Transaction failed');
            }

        } catch (error: any) {
            console.error('Error buying with ETH:', error);
            toaster.create({
                title: "Transaction failed",
                description: error.message || "An error occurred",
                type: "error",
                duration: 5000,
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, buyingETH: false }));
        }
    }, [isConnected, address, getCrowdsaleContract, fetchBalances]);

    // Buy tokens with USDT
    const buyWithUSDT = useCallback(async (usdtAmount: string) => {
        if (!isConnected || !address) {
            toaster.create({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, buyingUSDT: true }));
            const usdtContract = await getUSDTContract(true);
            const crowdsaleContract = await getCrowdsaleContract(true);
            const usdtInWei = ethers.utils.parseUnits(usdtAmount, 18);

            // Check allowance
            const allowance = await usdtContract.allowance(address, CONTRACTS.CROWDSALE);

            if (allowance.lt(usdtInWei)) {
                setLoadingStates(prev => ({ ...prev, approving: true }));

                try {
                    const approveTx = await usdtContract.approve(CONTRACTS.CROWDSALE, usdtInWei);
                    const approveReceipt = await approveTx.wait();

                    if (approveReceipt.status !== 1) {
                        throw new Error(`USDT approval failed. Transaction hash: ${approveReceipt.transactionHash}`);
                    }

                    toaster.create({
                        title: "USDT approved",
                        description: "Now proceeding with purchase...",
                        type: "success",
                        duration: 3000,
                    });
                } finally {
                    setLoadingStates(prev => ({ ...prev, approving: false }));
                }
            }

            // Estimate gas first
            const gasEstimate = await crowdsaleContract.estimateGas.buyTokenByUSDT(usdtInWei);

            const tx = await crowdsaleContract.buyTokenByUSDT(usdtInWei, {
                gasLimit: gasEstimate.mul(120).div(100) // +20% buffer
            });

            // Wait with timeout
            const receipt = await Promise.race([
                tx.wait(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Transaction timeout after 5 minutes')), 300000)
                )
            ]);

            if (receipt.status === 1) {
                toaster.create({
                    title: "Purchase successful!",
                    description: `Transaction hash: ${receipt.transactionHash}`,
                    type: "success",
                    duration: 5000,
                });
                await fetchBalances();
            } else {
                throw new Error(`Transaction failed. Hash: ${receipt.transactionHash}`);
            }

        } catch (error: any) {
            console.error('Error buying with USDT:', error);
            toaster.create({
                title: "Transaction failed",
                description: error.message || "An error occurred",
                type: "error",
                duration: 5000,
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, buyingUSDT: false }));
        }
    }, [isConnected, address, getUSDTContract, getCrowdsaleContract, fetchBalances]);

    // Initialize data when connected
    useEffect(() => {
        if (isConnected && provider) {
            fetchRates();
            fetchBalances();
        }
    }, [isConnected, provider, fetchRates, fetchBalances]);

    return {
        // State
        ethRate,
        usdtRate,
        oceanBalance,
        usdtBalance,
        ethBalance,
        loadingStates,
        isConnected,

        // Functions
        calculateTokensFromETH,
        calculateTokensFromUSDT,
        buyWithETH,
        buyWithUSDT,
        fetchBalances,
        fetchRates
    };
}