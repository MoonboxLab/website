"use client"
import React from "react"

interface WhitelistWayProps {
  title: string
}
const WhitelistWay: React.FC<React.PropsWithChildren<WhitelistWayProps>> = (props) => {
  const { title, children } = props

  return <div className=" rounded-[8px] overflow-hidden mb-3 sm:mb-[30px] ">
    <div className="text-[18px] leading-[18px]  px-[15px]  sm:leading-6 sm:px-[30px] lg:px-[40px] lg:text-[20px] 3xl:text-2xl py-3 bg-black text-white 4xl:py-4 ">
      {title}
    </div>
    <div className=" bg-white pt-[10px] px-3 pb-5 sm:p-[30px] lg:p-[40px] lg:pt-[30px] 4xl:pt-[40px]">
      {children}
    </div>
  </div>
}

export default WhitelistWay