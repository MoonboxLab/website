"use client"
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useChat } from '@/lib/useChat'
import BotMessageItem from "@/components/BotMessageItem";
import UserMessageItem from "@/components/UserMessageItem";
import { track } from "@vercel/analytics/react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

export default function Chat() {
  const t = useTranslations('Home');
  const chatListBottomRef = useRef<HTMLEmbedElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [{
      id: 'InitInfo',
      role: "assistant",
      content: t.raw('ai_sayhi')
    }],
    onError(error) {
      console.log(error)
    },
  });

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({ top: chatListBottomRef.current?.scrollHeight, behavior: "smooth" })
  }, [chatListBottomRef.current?.scrollHeight, messages])

  return <div className=" relative h-screen w-screen">
    <Image src={"/chat_background.png"} alt='background_image' fill style={{ objectFit: 'cover' }} className=" relative z-0 h-screen w-screen" priority />
    <Header />
    <div className="h-[75%] relative z-10 4xl:w-[932px] sm:w-[832px] w-[92%] mx-auto top-[50%] translate-y-[-50%]">
      <div className='h-[98%] sm:h-[92%] overflow-y-scroll hide-scrollbar' ref={chatListBottomRef}>
        {
          messages.length === 1 ?
            <BotMessageItem message={messages[0].content} id={messages[0].id} key={messages[0].id} /> :
            messages.map(item => {
              if (item.role == 'assistant') {
                return <BotMessageItem message={item.content} id="" key={`${item.id}_${new Date().toString()}`} />
              }
              if (item.role == 'user') {
                return <UserMessageItem message={item.content} key={item.id} />
              }
            })
        }
      </div>
      <form className="" onSubmit={(...args) => {
        handleSubmit(...args);
        track('SendMessage');
      }}>
        <div className={clsx('m-auto w-full max-w-[700px] h-[48px] sm:h-[68px] rounded-[12px]  border-[2px] border-white/10 flex p-[4px] sm:px-[10px] sm:py-[8px] bg-black/40  sm:bg-[#1D1D1DFF] 4xl:max-w-[800px]')}>
          <Input value={input} onChange={(e) => {
            handleInputChange(e);
            if (!activeInput && Boolean(input)) {
              setActiveInput(true)
            }
            if (activeInput && !Boolean(input)) {
              setActiveInput(false)
            }
          }}
            ref={chatInputRef} placeholder={t('chat_model_placeholder')} className={clsx(
              'h-[36px] sm:h-[48px] bg-transparent placeholder:text-[18px] placeholder:leading-[24px] placeholder:font-normal placeholder:text-white/20 text-[18px] font-normal text-white leading-[24px] pl-1 sm:p-0 border-none ring-0 focus-visible:ring-0 focus:outline-none active:outline-none active:ring-0 focus:ring-0 focus-visible:ring-offset-0')} />
          <button type='submit' className={clsx(
            "inline-flex items-center justify-center w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] rounded-[8px]  ml-1 sm:ml-[10px] shrink-0 cursor-pointer",
            Boolean(chatInputRef.current?.value) ? "bg-[#3B84FFFF]" : 'bg-white/20'
          )}
          >
            <svg className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4973" fill={Boolean(chatInputRef.current?.value) ? "#fff" : "#ffffff80"}><path d="M478.4128 491.7248l-202.1376-30.1056a81.92 81.92 0 0 1-64.67584-52.38784L125.52192 178.4832c-7.8848-21.17632 2.49856-44.8512 23.22432-52.92032a39.38304 39.38304 0 0 1 31.90784 1.47456L878.592 475.15648c19.90656 9.9328 28.18048 34.48832 18.432 54.82496-3.8912 8.21248-10.40384 14.848-18.432 18.8416L180.6336 896.96256a39.77216 39.77216 0 0 1-53.6576-18.8416 41.7792 41.7792 0 0 1-1.45408-32.58368l86.07744-230.74816a81.92 81.92 0 0 1 64.67584-52.38784l202.1376-30.1056a20.48 20.48 0 0 0 0-40.5504z"></path></svg>
          </button>
        </div>
      </form>
      {/* <div className=' hidden sm:flex justify-center mt-[20px] 3xl:mt-[28px] 4xl:mt-[40px]' >
        <div
          onClick={() => { setShowChatModal(false) }}
          className='text-[16px] leading-[16px] font-normal text-white w-[170px] h-[42px] rounded-[24px] bg-white/10 border-white/20 border-[1px] inline-flex items-center justify-center cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.5)] 4xl:text-[18px] 4xl:leading-[18px] 4xl:w-[180px] 4xl:h-[48px]'>
          {t('chat_modal_closeBtn')}</div>
      </div> */}
    </div>
  </div>
}