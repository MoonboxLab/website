"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslations } from 'next-intl';
import { useDisconnect } from 'wagmi';
import { Power } from 'lucide-react';


const CustomConnectButton = () => {
  const { disconnect } = useDisconnect();
  const t = useTranslations('Home');

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button className='hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] shadow-[4px_4px_0px_rgba(0,0,0,1)] font-semibold text-[21px]' onClick={openConnectModal} type="button">
                    {t("header_connect_wallet")}
                  </button>
                );
              }
              return (
                <button
                  className='hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] shadow-[4px_4px_0px_rgba(0,0,0,1)] font-semibold text-[21px]'
                  onClick={() => disconnect()}
                  type="button"
                >
                  <Power className=' mr-3 text-black font-semibold' /> {t("disconnect")}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};


export default CustomConnectButton