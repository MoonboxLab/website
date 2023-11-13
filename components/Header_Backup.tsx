"use client"

import Link from "next/link"
import { Button } from '@/components/ui/button';
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const { openConnectModal } = useConnectModal()
  const { address } = useAccount()


  return <header className='h-12 sm:h-[72px] 3xl:h-[80px] flex items-center'>
    <div className=' hidden w-full sm:flex sm:px-[20px] xl:px-[32px] justify-between items-center 3xl:px-[50px] bg-white'>
      <Link href={"/"}>
        <div className=' font-extrabold'>
          Logo
        </div>
      </Link>

      <nav className=' inline-flex grow justify-end space-x-10 mx-10'>
        <a href='/' >Home</a>
        <a href='/'>About</a>
        <Link href={"/mint"} >Mint</Link>
      </nav>
      <div>
        {
          address ? <ConnectButton label='Connect' accountStatus={"address"} showBalance={false} chainStatus={"none"} /> :
            <Button className=' w-[140px] bg-active rounded-[30px] hover:bg-active' onClick={() => {
              openConnectModal && openConnectModal()
            }}>Connect</Button>
        }

      </div>
    </div>
    <div className='sm:hidden h-full w-full flex justify-between items-center px-5'>
      <Link href={"/"}>
        <div className=' font-semibold'>
          Logo
        </div>
      </Link>

      <svg className="w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2276" ><path d="M128 469.333333m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533334l0 4.266666q0 40.533333-40.533333 40.533334l-686.933334 0q-40.533333 0-40.533333-40.533334l0-4.266666q0-40.533333 40.533333-40.533334Z" fill="#2c2c2c" p-id="2277"></path><path d="M128 682.666667m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533333l0 4.266667q0 40.533333-40.533333 40.533333l-686.933334 0q-40.533333 0-40.533333-40.533333l0-4.266667q0-40.533333 40.533333-40.533333Z" fill="#2c2c2c" p-id="2278"></path><path d="M128 256m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533333l0 4.266667q0 40.533333-40.533333 40.533333l-686.933334 0q-40.533333 0-40.533333-40.533333l0-4.266667q0-40.533333 40.533333-40.533333Z" fill="#2c2c2c" p-id="2279"></path></svg>
    </div>
  </header>
}

export default Header