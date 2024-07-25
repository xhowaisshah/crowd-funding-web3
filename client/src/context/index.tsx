'use client';
import { createContext, useContext, ReactNode } from "react";
import { useContract, useContractWrite, useAddress, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { ethers, BigNumber } from "ethers";
import { pid } from "process";

interface CampaignForm {
    name: string;
    title: string;
    description: string;
    target: BigNumber;
    deadline: string;
    image: string;
}

interface Campaign {
    owner: string;
    title: string;
    description: string;
    target: string;
    deadline: string;
    amountCollected: string;
    image: string;
    pId: number;
}

interface StateContextType {
    address: string | undefined;
    contract: any;
    createCampaign: (form: CampaignForm) => Promise<void>;
    connect: () => void;
    getCampaigns: () => Promise<Campaign[]>;
    getFilteredCampaign: (pId: number) => Promise<Campaign[]>;
    getUserCampaign: () => Promise<Campaign[]>
    donate: (pId: number, amount: string) => Promise<any[]>, 
    getDonations: (pId: number) => Promise<any[]>
}

export const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateContextProvider = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {

    const { contract, isLoading, error } = useContract("0xce2F3A5fE2891ffa352307c06491369bdd4eb00b");
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCompaign');

    const address = useAddress();
    const connect = useConnect();
    const metamaskConfig = metamaskWallet();

    const handleConnect = async () => {
        try {
            const wallet = await connect(metamaskConfig);
            console.log("connected to ", wallet);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    const publishCampaign = async (form: CampaignForm) => {
        console.log(form)
        try {
            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
					new Date(form.deadline).getTime(),
                    form.image
                ]
            });

            console.log("contract call success", data)
        } catch (error) {
            console.error("Failed to publish campaign:", error);
        }
    }

    const getCampaigns = async (): Promise<Campaign[]> => {
        if (!contract) {
            console.error("Contract is not available");
            return [];
        }

        try {
            const campaigns = await contract.call('getCompaigns');
            return campaigns.map((campaign: any, i: number) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.discription,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i,
            }));
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            return [];
        }
    }

    const getUserCampaign = async (): Promise<Campaign[]> => {
        try {
            const allCampaigns = await getCampaigns();
            return allCampaigns.filter((campaign: Campaign) => campaign.owner === address);
        } catch (error) {
            console.error("Failed to fetch user campaigns:", error);
            return [];
        }
    }

    const getFilteredCampaign = async (pId: number): Promise<Campaign[]> => {
        try {
            const allCampaigns = await getCampaigns();
            console.log(allCampaigns.filter((campaign: Campaign) => campaign.pId === pId))
            return allCampaigns.filter((campaign: Campaign) => campaign.pId === pId);
        } catch (error) {
            console.error("Failed to fetch user campaigns:", error);
            return [];
        }
    }

    const donate = async (pId: number, amount: string): Promise<any[]> => {
        try {
            if (!contract) {
                console.error("Contract is not available");
                return [];
            }
            const data = await contract.call('donateToCompaign', [pId], { value: ethers.utils.parseEther(amount) });
            return data;
        } catch (error) {
            console.error("Failed to donate:", error);
            return [];
        }
    }

    const getDonations = async (pId: number): Promise<any[]> => {
        if (!contract) {
            console.error("Contract is not available");
            return [];
        }

        try {
            const donations = await contract.call('getDonators', [pId]);
            const numberOfDonations = donations[0].length;

            console.log(donations)
            const parsedDonations = [];

            for (let i = 0; i < numberOfDonations; i++) {
                parsedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(donations[1][i].toString())
                })
            }

            return parsedDonations;
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            return [];
        }
    }

    return (
        <StateContext.Provider value={{ 
            address, 
            contract, 
            createCampaign: publishCampaign, 
            connect: handleConnect, 
            getCampaigns, 
            getFilteredCampaign, 
            getUserCampaign, 
            donate, 
            getDonations
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error("useStateContext must be used within a StateContextProvider");
    }
    return context;
};