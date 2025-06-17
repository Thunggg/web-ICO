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
    const [isLoading, setIsLoading] = useState(false);

    // Get contract instances
    const getCrowdsaleContract = useCallback(async (needsSigner = false) => {
        if (!provider) throw new Error('Provider not available');

        if (needsSigner) {
            const signer = await getSigner();
            return new Contract(CONTRACTS.CROWDSALE, CROWDSALE_ABI, signer);
        }
        return new Contract(CONTRACTS.CROWDSALE, CROWDSALE_ABI, provider);
    }, [provider, getSigner]);

    const getTokenContract = useCallback(async (tokenAddress: string, needsSigner = false) => {
        if (!provider) throw new Error('Provider not available');

        if (needsSigner) {
            const signer = await getSigner();
            return new Contract(tokenAddress, ERC20_ABI, signer);
        }
        return new Contract(tokenAddress, ERC20_ABI, provider);
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
                getTokenContract(CONTRACTS.OCEAN_TOKEN),
                getTokenContract(CONTRACTS.USDT)
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
    }, [address, provider, getTokenContract]);

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
            setIsLoading(true);
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

            toaster.create({
                title: "Purchase successful!",
                description: `You bought OCEAN tokens with ${ethAmount} ETH`,
                type: "success",
                duration: 5000,
            });

            // Refresh balances
            await fetchBalances();

        } catch (error: any) {
            console.error('Error buying with ETH:', error);
            toaster.create({
                title: "Transaction failed",
                description: error.message || "An error occurred",
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
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
            setIsLoading(true);
            const usdtContract = await getTokenContract(CONTRACTS.USDT, true);
            const crowdsaleContract = await getCrowdsaleContract(true);
            const usdtInWei = ethers.utils.parseUnits(usdtAmount, 18);

            // Check allowance
            const allowance = await usdtContract.allowance(address, CONTRACTS.CROWDSALE);

            if (allowance.lt(usdtInWei)) {
                // Need to approve first
                toaster.create({
                    title: "Approving USDT...",
                    description: "Please approve USDT spending first",
                    type: "info",
                    duration: 5000,
                });

                const approveTx = await usdtContract.approve(CONTRACTS.CROWDSALE, usdtInWei);
                await approveTx.wait();

                toaster.create({
                    title: "USDT approved",
                    description: "Now proceeding with purchase...",
                    type: "success",
                    duration: 3000,
                });
            }

            // Buy tokens
            const tx = await crowdsaleContract.buyTokenByUSDT(usdtInWei);

            toaster.create({
                title: "Transaction sent",
                description: "Please wait for confirmation...",
                type: "info",
                duration: 5000,
            });

            const receipt = await tx.wait();

            toaster.create({
                title: "Purchase successful!",
                description: `You bought OCEAN tokens with ${usdtAmount} USDT`,
                type: "success",
                duration: 5000,
            });

            // Refresh balances
            await fetchBalances();

        } catch (error: any) {
            console.error('Error buying with USDT:', error);
            toaster.create({
                title: "Transaction failed",
                description: error.message || "An error occurred",
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, address, getTokenContract, getCrowdsaleContract, fetchBalances]);

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
        isLoading,
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