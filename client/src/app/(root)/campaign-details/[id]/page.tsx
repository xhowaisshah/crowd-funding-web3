'use client';

import Image from "next/image";
import { thirdweb } from "@/assets";
import CountBox from "@/components/countBox";
import CustomButton from "@/components/customButton";
import Loader from "@/components/loader";
import { useStateContext } from "@/context";
import { calculateBarPercentage, daysLeft, isImageAvailable } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
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

interface Donator {
  donator: string;
  donation: string;
}

const CampaignDetails = () => {
  const router = useRouter();
  const seachParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCapaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState<Donator[]>([]);

  const id = seachParams.get('id');
  const { getFilteredCampaign, donate, getDonations, contract, address } = useStateContext();

  const fetchFilteredCampaign = async () => {
    if (id) {
      const data = await getFilteredCampaign(parseInt(id));
      console.log(data)
      setCapaign(data[0]);
      console.log(isImageAvailable(data[0].image), data[0].image)
    }
  };

  const fetchDonations = async () => {
    if (id) {
      const data = await getDonations(parseInt(id))
      setDonators(data)
    }
  }

  useEffect(() => {
    if (contract) {
      fetchFilteredCampaign();
      fetchDonations()
    };
  }, [contract, id]);

  const handleDonate = async () => {
    if (campaign) {
      setIsLoading(true);

      await donate(campaign.pId, amount);

      router.push('/')
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      {campaign && (
        <>
          <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
            <div className="flex-1 flex-col">
              {isImageAvailable(campaign.image) ? (
                <Image  src={campaign.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" onError={(e) => e.currentTarget.src = ''} width={100} height={100} unoptimized />
              ) : (
                <div className="w-full h-[410px] flex items-center justify-center bg-[#3a3a43] rounded-xl">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191]">Image not available</p>
                </div>
              )}
              <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
                <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(parseInt(campaign.target), parseInt(campaign.amountCollected))}%`, maxWidth: '100%' }}>
                </div>
              </div>
            </div>

            <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
              <CountBox title="Days Left" value={daysLeft(campaign.deadline)} />
              <CountBox title={`Raised of ${campaign.target}`} value={campaign.amountCollected} />
              <CountBox title="Total Backers" value={donators.length.toString()} />
            </div>
          </div>

          <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
            <div className="flex-[2] flex flex-col gap-[40px]">
              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

                <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                  <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                    <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{campaign.owner}</h4>
                    <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Story
                </h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{campaign.description}</p>
                </div>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

                <div className="mt-[20px] flex flex-col gap-4">
                  {donators.length > 0 ? donators.map((item, index) => (
                    <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                      <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                    </div>
                  )) : (
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>

              <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                  Fund the campaign
                </p>
                <div className="mt-[30px]">
                  <input
                    type="number"
                    placeholder="ETH 0.1"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
                  </div>

                  <CustomButton
                    btnType="button"
                    title="Fund Campaign"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignDetails;