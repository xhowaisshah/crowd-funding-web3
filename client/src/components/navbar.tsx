'use client';
import React, { useState } from 'react';
import { logo, menu, search, thirdweb } from '@/assets';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CustomButton from './customButton';
import Link from 'next/link';
import { navlinks } from '@/constants';
import { useStateContext } from '@/context';

const Navbar: React.FC = () => {
    const router = useRouter();
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);

    const { connect, address } = useStateContext();

    const handleNavButton = () => {
        if (address) {
            router.push('create-campaign');
        } else {
            // Assuming connect() is a function to connect wallet
            connect();
        }
    };

    const handleMenuCollapse = () => {
        setToggleDrawer(!toggleDrawer);
    };

    const handleMBMenuItem = (link: typeof navlinks[0]) => {
        setIsActive(link.name);
        setToggleDrawer(false);
    };

    return (
        <div className='flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6'>
            <div className='lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]'>
                <input
                    type='text'
                    placeholder='Search for campaigns'
                    className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'
                />
                <div className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
                    <Image src={search} alt='search' className='w-[15px] h-[15px] object-contain' />
                </div>
            </div>

            <div className="sm:flex hidden flex-row justify-end gap-4">
                <CustomButton
                    btnType="button"
                    title={address ? 'Create a campaign' : 'Connect'}
                    styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                    handleClick={handleNavButton}
                />

                <Link href="/profile">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                        <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
                    </div>
                </Link>
            </div>

            {/* Small screen Navigation */}
            <div className="sm:hidden flex justify-between items-center relative">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                    <Image src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
                </div>

                <Image
                    src={menu}
                    alt="menu"
                    className="w-[34px] h-[34px] object-contain cursor-pointer"
                    onClick={handleMenuCollapse}
                />

                <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
                    <ul className="mb-4">
                        {navlinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                                onClick={() => handleMBMenuItem(link)}
                            >
                                <Image
                                    src={link.imgUrl}
                                    alt={link.name}
                                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                                />
                                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                                    {link.name}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex mx-4">
                        <CustomButton
                            btnType="button"
                            title={address ? 'Create a campaign' : 'Connect'}
                            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                            handleClick={handleNavButton}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;