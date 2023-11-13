"use client"
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import 'core-js/features/object/has-own';
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import FirstSection from './home_section'
import {
  FullpageContainer,
  FullpageSection,
} from '@shinyongjun/react-fullpage';
import '@shinyongjun/react-fullpage/css';
import Typed from 'typed.js'

export default function Home() {
  const t = useTranslations('Home');

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const secondPageStoryIntroduce = useRef<HTMLDivElement>(null);

  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTypedSecondPage, setTypedSecondPage] = useState<boolean>(false);

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({ top: chatListBottomRef.current?.scrollHeight, behavior: "smooth" })
  }, [chatListBottomRef.current?.scrollHeight])

  useEffect(() => {
    if (activeIndex == 1 && !isTypedSecondPage) {
      var typed = new Typed(secondPageStoryIntroduce.current, {
        strings: [t('story_introduce')],
        typeSpeed: 20,
      })
      setTypedSecondPage(true)
    }
  }, [activeIndex])

  return (
    <div className=' bg-gray-600'>
      <Head>
        <title>Moonbox</title>
        <meta name="description" content="Bring life to NFTs" />
        <meta
          property="og:title"
          content="Moonbox"
        />
        <meta
          property="og:description"
          content="Bring life to NFTs"
        />
        <meta
          property="og:image"
          content="/home_video_cover.png"
        />
        <meta
          property="og:url"
          content="https://moonbox.com"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />

      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        transitionDuration={600}
        onBeforeChange={(before, after) => {
          if (showChatModal) {
            setActiveIndex(0)
          }
        }}
      >
        <FullpageSection>
          <FirstSection
            playingMedia={playingMedia}
            setPlayingMedia={setPlayingMedia}
            showChatModal={showChatModal}
            setShowChatModal={setShowChatModal} />
        </FullpageSection>

        <FullpageSection>
          <div className=" w-full h-screen bg-[#151515] bg-contain bg-[80%_80%] bg-[url('/bg-section2.png')] relative flex items-center">
            <div className=' absolute scale-[0.3] top-[8%] sm:top-[130px] left-[-5%] sm:left-[170px] w-[186px] h-[128px] sm:scale-50 lg:scale-[0.6] 2xl:scale-[0.7] 3xl:scale-[0.8] 4xl:scale-[0.9]'>
              <Image src="/spaceship.png" alt='spaceship' fill />
            </div>
            <div className=' absolute sm:bottom-[122px] bottom-[8%] right-[3%] sm:right-[171px] w-[125px] h-[139px] scale-[0.50] sm:scale-50  2xl:scale-75 3xl:scale-100'>
              <Image src="/rocket.png" alt='rocket' fill />
            </div>
            <div className=' m-auto max-w-[80%] lg:ml-[170px] relative z-10 '>
              <p className=' text-[24px] leading-[36px] lg:text-[32px] lg:leading-[42px] 3xl:text-[36px] 3xl:leading-[48px] font-medium text-white max-w-[1093px]' ref={secondPageStoryIntroduce}></p>
            </div>
          </div>
        </FullpageSection>

      </FullpageContainer>
    </div>
  )
}
