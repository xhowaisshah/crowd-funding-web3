'use client';
import { sun } from "@/assets";
import logo from "@/assets/logo.svg";
import { navlinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IconProps {
    styles: string;
    name?: string;
    imgUrl: string;
    isActive?: string;
    disabled?: boolean;
    handleClick?: () => void;
}

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }: IconProps) => (
    <div
        className={`w-[48px] h-[48px] rounded-[10px] ${isActive === name ? 'bg-[#2c2f32]' : ''} flex justify-center items-center ${!disabled ? 'cursor-pointer' : ''} ${styles}`}
        onClick={handleClick}
    >
        <Image
            src={imgUrl}
            alt="icon"
            className={`w-1/2 h-1/2 ${isActive !== name ? 'grayscale' : ''}`}
        />
    </div>
);

const Sidebar = () => {
    const router = useRouter();
    const [isActive, setIsActive] = useState('Dashboard');

    const handleSideBarItem = (link: typeof navlinks[0]) => {
        if (!link.disabled) {
            setIsActive(link.name);
            router.push(link.link);
        }
    };

    return (
        <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
            <Link href="/">
                <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
            </Link>

            <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
                <div className="flex flex-col justify-center items-center gap-3">
                    {navlinks.map((link) => (
                        <Icon
                            key={link.name}
                            {...link}
                            styles=""
                            isActive={isActive}
                            handleClick={() => handleSideBarItem(link)}
                        />
                    ))}
                </div>

                <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
            </div>
        </div>
    );
};

export default Sidebar;