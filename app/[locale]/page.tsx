"use client"
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { RefObject, cache, useEffect, useRef, useState, useTransition } from 'react'
import ReactPlayer from 'react-player'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useLocalStorageState, useSize } from 'ahooks'
import Head from 'next/head'
import { useChat } from 'ai/react';
import { track } from '@vercel/analytics';
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next-intl/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import FirstSection from './home_section'
import {
  FullpageContainer,
  FullpageSection,
} from '@shinyongjun/react-fullpage';
import '@shinyongjun/react-fullpage/css';
import Typed from 'typed.js'

export default function Home() {
  const t = useTranslations('Home');

  const playerRef = useRef<ReactPlayer>();
  const inputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);
  const fullpageRef = useRef<HTMLDivElement>(null);

  const secondPageStoryIntroduce = useRef<HTMLDivElement>(null);

  const mediaSize = useSize(document.querySelector('body'));

  const [showMainModal, setShowMainModal] = useState<boolean>(false);
  const [showSecondModal, setShowSecondModal] = useState<boolean>(true);
  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitingEmail, setSubmitingEmail] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTypedSecondPage, setTypedSecondPage] = useState<boolean>(false);


  const [isSubmitedEmail, setSubmitEmail] = useLocalStorageState<boolean | undefined>(
    "moonbox-email-submit", {
    defaultValue: false
  }
  )

  const [isMuted, setVidoeMuted] = useLocalStorageState<boolean | undefined>(
    "moonbox-hove-video-mute", {
    defaultValue: false
  }
  )

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [{
      id: 'InitInfo',
      role: "assistant",
      content: "I'm a helpful assistant. Do you want to chat with me?"
    }],
  });

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({ top: chatListBottomRef.current?.scrollHeight, behavior: "smooth" })
  }, [chatListBottomRef.current?.scrollHeight])

  useEffect(() => {
    if (activeIndex == 1 && !isTypedSecondPage) {
      var typed = new Typed(secondPageStoryIntroduce.current, {
        strings: [t('story_introduce')],
        typeSpeed: 20,
        // cursorChar: ""
      })
      setTypedSecondPage(true)
    }
  }, [activeIndex])

  const handleLocaleChange = (locale: String) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale })
    })
  }

  const submitEmail = async (inputEmail: String) => {
    setSubmitting(true);

    try {
      const { status, statusText } = await fetch("/api/add-email", {
        method: 'POST',
        body: JSON.stringify({ "email": inputEmail })
      })

      if (status == 200) {
        toast.success(t('submit_success'), {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setShowMainModal(false);

        setSubmitEmail(true);

        if (inputRef.current?.value) {
          inputRef.current.value = ""
        }
        if (secondInputRef.current?.value) {
          secondInputRef.current.value = ""
        }

      } else {
        toast.error(
          statusText, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
        )
      }
    } catch (err: any) {
      console.log(err)
      toast.error(
        err.message || "Submit Error", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
      )
    }
    setSubmitting(false);
  }

  const sendWeclomeEmailToUser = async (email: string, captchaRes: Record<string, any>) => {
    try {
      const result = await fetch('https://dev-server-api.mbxlab.io/email/send', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          ticket: captchaRes.ticket,
          rand: captchaRes.randstr
        })
      })
      console.log(result)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmitEmail = async (valueRef: RefObject<HTMLInputElement>) => {
    if (isSubmitting) return

    const inputRef = valueRef;
    const inputEmail = inputRef.current?.value || "";
    if (!inputEmail) return

    if (!isValidEmail(inputEmail)) {
      toast.warn(t('submit_email_format_error'), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }

    // 验证码逻辑
    try {
      // @ts-ignore
      var captcha = new TencentCaptcha("189994500", (res) => {
        console.log(res)
        if (res.ret == 0) {
          submitEmail(inputEmail)
          sendWeclomeEmailToUser(inputEmail, res);
        }
      }, {
        // userLanguage: locale == 'en' ? "en" : 'zh-cn'
      })
      captcha.show();
    } catch (err) {
      console.log(err)
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  return (
    // <main className="flex h-screen flex-col items-center justify-between bg-gray-500">
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

      <header className='absolute z-[100] top-0 flex items-center justify-between w-full px-[16px] mt-[20px] lg:px-[40px] lg:mt-[40px] sm:z-[300]'>
        <a href='/'>
          <div className='relative w-[36px] h-[36px] sm:w-[177px] sm:h-[36px] lg:w-[236px] lg:h-[48px]'>
            <Image src={(mediaSize?.width || 0) > 640
              ? "/moonbox_logo_white.png"
              : "/moonbox_logo_mobile.png"} alt='logo' priority={true} fill style={{ objectFit: 'contain' }} />
          </div>
        </a>

        <div className=' flex items-center'>
          {(mediaSize?.width || 0) > 640 &&
            <div className=' inline-flex items-end justify-center h-[36px] w-[108px] lg:h-[48px] lg:w-[136px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-[10px] sm:ml-4 hover-btn-shadow'
              onClick={() => {
                if (!showChatModal) {
                  track("OpenChat")
                }
                // 回滚到首屏
                setActiveIndex(0)
                setShowChatModal(true)
              }}>
              <Image src={"/chat_bot_avatar.png"} alt='Chat bot avatar' width={(mediaSize?.width || 0) > 1024 ? 44 : 35} height={(mediaSize?.width || 0) > 1024 ? 57 : 45} />
              <span className='text-[16px] leading-[32px] sm:text-[21px] lg:leading-[43px] font-semibold text-black ml-[6px] lg:ml-[10px]'>{t('header_chat')}</span>
            </div>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className=' inline-flex items-center justify-center h-[36px] w-[72px] lg:h-[48px] lg:w-[96px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-[10px] sm:ml-4 hover-btn-shadow'>
                <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4000" width="64" height="64"><path d="M697.984 598.016l144 0q11.989333-56.021333 11.989333-86.016t-11.989333-86.016l-144 0q6.016 41.984 6.016 86.016t-6.016 86.016zM621.994667 834.005333q121.984-40.021333 185.984-152.021333l-125.994667 0q-20.010667 80-59.989333 152.021333zM612.010667 598.016q6.016-41.984 6.016-86.016t-6.016-86.016l-200.021333 0q-6.016 41.984-6.016 86.016t6.016 86.016l200.021333 0zM512 852.010667q56.021333-82.005333 82.005333-169.984l-164.010667 0q25.984 88.021333 82.005333 169.984zM342.016 342.016q20.010667-80 59.989333-152.021333-121.984 40.021333-185.984 152.021333l125.994667 0zM216.021333 681.984q64 112 185.984 152.021333-40.021333-72.021333-59.989333-152.021333l-125.994667 0zM182.016 598.016l144 0q-6.016-41.984-6.016-86.016t6.016-86.016l-144 0q-11.989333 56.021333-11.989333 86.016t11.989333 86.016zM512 171.989333q-56.021333 82.005333-82.005333 169.984l164.010667 0q-25.984-88.021333-82.005333-169.984zM808.021333 342.016q-64-112-185.984-152.021333 40.021333 72.021333 59.989333 152.021333l125.994667 0zM512 86.016q176 0 301.013333 125.013333t125.013333 301.013333-125.013333 301.013333-301.013333 125.013333-301.013333-125.013333-125.013333-301.013333 125.013333-301.013333 301.013333-125.013333z" fill="#000000" p-id="4001"></path></svg>
                <span className=' text-[16px] leading-[16px] sm:text-[21px] sm:leading-[21px] font-semibold text-black ml-[6px]'>{t('header_language')}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=' mt-2 w-[160px] h-[110px] rounded-[12px] py-[14px]'>
              <DropdownMenuItem onClick={() => handleLocaleChange('en')} >
                <div className=' h-[25px] inline-flex items-center justify-between px-3'>
                  <span className=' text-[21px] font-semibold mr-[10px]'>En</span>
                  <span className=' text-[18px] leading-[18px] font-medium'>English</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocaleChange('zh')} className=' mt-2'>
                <div className=' h-[25px] inline-flex items-center justify-between px-3'>
                  <span className=' text-[21px] font-semibold mr-[10px]'>Zh</span>
                  <span className=' text-[18px] leading-[18px] font-medium'>繁体中文</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          <a href='https://twitter.com/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
            <div className=' inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[48px] lg:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow'>
              <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1458" ><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" p-id="1459" fill="#000"></path></svg>
            </div>
          </a>

          <a href='https://www.instagram.com/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
            <div className='inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[48px] lg:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]  hover-btn-shadow'>
              <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2717" ><path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9z m0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zM725.5 250.7c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9c-0.1-26.6-21.4-47.9-47.9-47.9z" p-id="2718" fill="#000"></path><path d="M911.8 512c0-55.2 0.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-0.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-0.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9 0.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165z m-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z" p-id="2719" fill="#000000"></path></svg>
            </div>
          </a>

          <a href='https://discord.gg/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
            <div className='inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[48px] lg:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]  hover-btn-shadow'>
              <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5511"><path d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z" p-id="5512" fill="#000000"></path></svg>
            </div>
          </a>
        </div>
      </header>

      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        transitionDuration={600}
        onBeforeChange={(before,after) => {
          if (showChatModal) {
            setActiveIndex(0)
          }
        }}
      >
        <FullpageSection>
          <FirstSection showChatModal={showChatModal} setShowChatModal={setShowChatModal} />
        </FullpageSection>
        <FullpageSection>
          <div className=" w-full h-screen bg-[#151515] bg-contain bg-[80%_80%] bg-[url('/bg-section2.png')] relative flex items-center">
            <div className=' absolute scale-[0.45] top-[8%] sm:top-[130px] left-[-5%] sm:left-[170px] w-[186px] h-[128px] sm:scale-50 lg:scale-[0.6] 2xl:scale-[0.7] 3xl:scale-[0.8] 4xl:scale-[0.9]'>
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
