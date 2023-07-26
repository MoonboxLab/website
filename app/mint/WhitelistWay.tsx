"use client"
import React from "react"

interface WhitelistWayProps {
  title: string
}
const WhitelistWay: React.FC<React.PropsWithChildren<WhitelistWayProps>>  = (props) => {
  const { title, children} = props

  return <div className=" rounded-[8px] overflow-hidden mb-3 sm:mb-[30px] ">
    <div className=" text-[18px] sm:text-2xl leading-[18px] sm:leading-6 px-[15px] sm:px-[40px] py-4 bg-black text-white ">
      {title}
    </div>
    <div className=" bg-white pt-[10px] px-3 pb-5 sm:p-[40px]">
      {children}
    </div>
  </div>
}

export default WhitelistWay