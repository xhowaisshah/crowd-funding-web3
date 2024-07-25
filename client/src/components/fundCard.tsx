'use client';
import React, { useState } from 'react';

import { daysLeft, isImageAvailable } from '@/utils';
import Image from 'next/image';
import thirdweb from '@/assets/thirdweb.png';
import tagType from '@/assets/type.svg';

interface FundCardProps {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: string;
  amountCollected: string;
  image: string;
  handleClick: () => void;
}

const FundCard: React.FC<FundCardProps> = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }) => {
  const remainingDays = daysLeft(deadline);
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
      {isImageAvailable(imgSrc) ? (
        <Image 
          src={imgSrc} 
          alt="fund" 
          className="w-full h-[158px] object-cover rounded-[15px]" 
          width={100} 
          height={100} 
          unoptimized={true} 
          onError={() => setImgSrc(thirdweb as unknown as string)}
        />
      ) : (
        <div className="w-full h-[158px] flex items-center justify-center bg-[#3a3a43] rounded-[15px]">
          <p className="font-epilogue font-normal text-[16px] text-[#808191]">Image not available</p>
        </div>
      )}

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <Image src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" width={100} height={100}/>
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">Education</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{amountCollected}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised of {target}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <Image src={thirdweb as unknown as string} alt="user" className="w-1/2 h-1/2 object-contain" width={100} height={100}/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div>
      </div>
    </div>
  )
}

export default FundCard