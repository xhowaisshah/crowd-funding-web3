'use client';

import DisplayCampaigns from "@/components/displayCampaigns";
import { useStateContext } from "@/context";
import { useEffect, useState } from "react";

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

const Profile = () => {
  const [isLoading, setisLoading] = useState(true);
  const [campaigns, setcampaigns] = useState<Campaign[]>([]);

  const { address, contract, getUserCampaign } = useStateContext();

  const fetchCampaigns = async () => {
    setisLoading(true);
    const data = await getUserCampaign();
    setcampaigns(data as unknown as Campaign[]);
    setisLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
    title="All Campaigns"
    isLoading={isLoading}
    campaigns={campaigns}
  />  );
}

export default Profile;
