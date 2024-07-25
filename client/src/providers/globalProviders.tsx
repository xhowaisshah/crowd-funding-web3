'use client';
import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "@/context";

const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  console.log(process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID!)
  return (
    <ThirdwebProvider 
    activeChain="sepolia"
    clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID!}
    >
      <StateContextProvider>
        {children}
      </StateContextProvider>
    </ThirdwebProvider>
  );
};

export default GlobalProviders;
