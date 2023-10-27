"use client"
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { RefObject, cache, useEffect, useRef, useState, useTransition } from 'react'
import ReactPlayer from 'react-player'
import Modal from 'react-modal'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useLocalStorageState, useSize } from 'ahooks'
import Head from 'next/head'
import { useChat } from 'ai/react';
import clsx from 'clsx'
import BotMessageItem from '../../components/BotMessageItem'
import UserMessageItem from '../../components/UserMessageItem'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next-intl/client'
import { animateScroll, scroller, Element } from 'react-scroll';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function Home() {
  const t = useTranslations('Home');

  const playerRef = useRef<ReactPlayer>();
  const inputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const mediaSize = useSize(document.querySelector('body'));

  const [showMainModal, setShowMainModal] = useState<boolean>(false);
  const [showSecondModal, setShowSecondModal] = useState<boolean>(true);
  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitingEmail, setSubmitingEmail] = useState<boolean>(false);

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
      var captcha = new TencentCaptcha("189960004", (res) => {
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

  console.log(messages)
  return (
    <main className="flex h-screen flex-col items-center justify-between bg-gray-500">
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
        <div className='relative w-[36px] h-[36px] sm:w-[177px] sm:h-[36px] lg:w-[236px] lg:h-[48px]'>
          <Image src={(mediaSize?.width || 0) > 640
            ? "/moonbox_logo_white.png"
            : "/moonbox_logo_mobile.png"} alt='logo' priority={true} fill style={{ objectFit: 'contain' }} />
        </div>

        <div className=' flex items-center'>
          {(mediaSize?.width || 0) > 640 &&
            <div className=' inline-flex items-end justify-center h-[36px] w-[108px] lg:h-[48px] lg:w-[136px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-[10px] sm:ml-4 hover-btn-shadow'
              onClick={() => setShowChatModal(true)}>
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

      <div className=' hidden sm:block h-full w-screen relative'>
        {(mediaSize?.width || 0) > 640 &&
          <ReactPlayer
            key={"PC"}
            // @ts-ignore
            ref={playerRef}
            playing={playingMedia}
            muted={isMuted}
            onEnded={() => {
              setPlayingMedia(false)
              // @ts-ignore
              playerRef.current?.seekTo(0, 'fraction')

              setShowChatModal(true);
            }}
            width={"100%"}
            height={"100%"}
            url={"/video_home.mp4"}
          />}

        {!playingMedia && <div className=' hidden sm:block w-full h-full absolute top-0 left-0 z-10'>
          <Image src={"/chat_background.png"} alt='background_image' fill style={{ objectFit: 'cover' }} priority />
          {!showChatModal && <Image src={"/home_video_cover.png"} alt='background_image' fill style={{ objectFit: 'cover' }} priority />}
        </div>}

        {!playingMedia && !showMainModal && !showChatModal &&
          <div className=' absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[96px] w-[96px] rounded-full bg-black/80 inline-flex items-center justify-center border-[4px] cursor-pointer z-[120] ' onClick={() => setPlayingMedia(true)}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6577" width="36" height="36"><path d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z" fill="#ffffff" p-id="6578"></path></svg>
          </div>}

        {playingMedia && <div className={clsx('absolute z-[11] cursor-pointer w-[64px] h-[64px] rounded-full right-[40px] bottom-[40px] inline-flex items-center justify-center bg-white/30')} onClick={() => setVidoeMuted(!isMuted)}>
          {isMuted ?
            <Image priority src={"/video_music_muted.png"} alt='volumn_switch_muted' width={40} height={40} /> :
            <Image priority src={"/video_music.gif"} alt='volumn_switch' width={40} height={40} />}
        </div>}
      </div>

      {/* Mobile Video */}
      <div className='h-full w-screen relative sm:hidden flex flex-col justify-center'>
        <div className='w-full h-full absolute top-0 left-0 '>
          <Image src={"/home_video_cover_mobile.jpg"} alt='background_image' fill style={{ objectFit: 'cover' }} sizes='100vw' quality={100} />
          {playingMedia && <div className='w-full h-full bg-black/80 relative z-[100]'></div>}
        </div>
        <div className=' relative z-[110]'>
          {/* Close Button */}
          {playingMedia && <div className=' absolute right-2 top-[-30px] w-[22px] h-[22px] rounded-full bg-slate-400/40 inline-flex items-center justify-center cursor-pointer'
            onClick={() => {
              setPlayingMedia(false);
              // @ts-ignore
              playerRef.current?.seekTo(0, 'fraction')
            }}
          >
            <X size={18} color='#d2d2d2' />
          </div>}

          {!playingMedia && <div className=' absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[64px] w-[64px] rounded-full bg-black/80 inline-flex items-center justify-center border-[2px] cursor-pointer z-[120] ' onClick={() => setPlayingMedia(true)}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6577" width="30" height="30"><path d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z" fill="#ffffff"></path></svg>
          </div>}

          <AspectRatio ratio={1920 / 1080}>
            {(mediaSize?.width || 0) <= 640 && playingMedia &&
              <ReactPlayer
                key={"Mobile"}
                // @ts-ignore
                ref={playerRef}
                pip={false}
                controls
                controlslist="nofullscreen play timeline volume"
                playing={playingMedia}
                onEnded={() => {
                  setPlayingMedia(false)
                  // @ts-ignore
                  playerRef.current?.seekTo(0, 'fraction')

                  if (!isSubmitedEmail) {
                    setShowMainModal(true);
                  }
                }}
                width="100%"
                height="auto"
                url={"/video_home.mp4"}
              />}
          </AspectRatio>
        </div>
      </div>

      {/* Main email modal */}
      <Modal
        isOpen={showMainModal}
        style={{
          content: {
            width: (mediaSize?.width || 0) > 640 ? "636px" : '350px',
            height: (mediaSize?.width || 0) > 640 ? "370px" : '305px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '24px',
            padding: 0,
            overflow: "visible",
          }
        }}
      >
        <div className=' absolute w-[96px] h-[91px] top-[-32px]  sm:w-[112px] sm:h-[107px] sm:top-[-39px] left-0 right-0 mx-auto'>
          <Image src="/mail_modal_ill.png" fill alt='mail modal' priority />
        </div>

        <div className=' absolute top-[20px] right-[20px] opacity-80 cursor-pointer' onClick={() => setShowMainModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h3 className=' mt-[78px] mb-[16px] px-[15px] text-[18px] leading-[24px] sm:mt-[86.6px]  sm:mb-[40px] sm:px-[20px] sm:text-[24px] sm:leading-[30px] font-semibold text-center'>
          {t('email_modal_title')}
        </h3>

        <Input placeholder={t('email_modal_input_placeholder')} className='mx-auto w-[300px] h-[48px] text-[16px] leading-[16px] px-4  
        sm:mx-[40px] sm:w-[556px] sm:h-[56px] rounded-full bg-black/10 sm:text-[18px] sm:leading-[18px] font-normal sm:px-6 outline-none focus:outline-none active:outline-none focus:ring-0 active:ring-0 focus-visible:ring-0 placeholder:text-[18px] placeholder:font-normal placeholder:text-black/20' ref={inputRef} />

        <Button className="flex mx-auto w-[300px] h-[48px] text-[16px] leading-[16px] sm:mx-[40px] sm:w-[556px] sm:h-[56px] rounded-full sm:text-[18px] sm:leading-[18px] font-semibold mt-[12px] sm:mt-[20px]"
          disabled={isSubmitting}
          onClick={() => handleSubmitEmail(inputRef)}
        >
          {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('email_modal_subscribe')}
        </Button>
      </Modal>

      {/* Bot Chat Modal  */}
      <Modal
        isOpen={showChatModal}
        style={{
          content: {
            width: (mediaSize?.width || 0) > 640 ? "832px" : '92%',
            height: (mediaSize?.width || 0) > 640 ? "70%" : '80%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: (mediaSize?.width || 0) > 640 ? 'transparent' : 'gray',
            borderRadius: (mediaSize?.width || 0) > 640 ? '24px' : '12px',
            border: "none",
            padding: (mediaSize?.width || 0) > 640 ? 0 : '10px',
            overflow: "visible",
            zIndex: '130'
          }
        }}
      >
        <div className=' flex justify-end sm:hidden mb-1'>
          <X color='white' onClick={() => setShowChatModal(false)} />
        </div>
        <div className='h-[84%] sm:h-[92%] min-h-[200px] overflow-y-scroll' ref={chatListBottomRef}>
          {
            messages.map(item => {
              if (item.role == 'assistant') {
                return <BotMessageItem message={item.content} id={messages.length == 1 ? item.id : ""} key={item.id} />
              }
              if (item.role == 'user') {
                return <UserMessageItem message={item.content} key={item.id} />
              }
            })
          }
        </div>
        <form onSubmit={(...args) => {
          handleSubmit(...args);
        }}>
          <div className={clsx('m-auto w-full max-w-[700px] h-[48px] sm:h-[68px] rounded-[12px]  border-[2px] border-white/10 flex p-[4px] sm:px-[10px] sm:py-[8px] bg-black/40  sm:bg-[#1D1D1DFF]')}>
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
        <div className=' hidden sm:flex justify-center mt-[40px]' >
          <div
            onClick={() => { setShowChatModal(false) }}
            className='text-[18px] leading-[18px] font-normal text-white w-[190px] h-[48px] rounded-[24px] bg-white/10 border-white/20 border-[1px] inline-flex items-center justify-center cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.5)]'>{t('chat_modal_closeBtn')}</div>
        </div>
      </Modal>

      {/* PC small modal */}
      {!playingMedia && !showMainModal && !showChatModal && (mediaSize?.width || 0) > 640
        && <Modal
          isOpen={showSecondModal}
          style={{
            content: {
              width: "450px",
              height: "200px",
              top: 'calc(100% - 220px)',
              left: '20px',
              borderRadius: '16px',
              background: 'rgba(77, 88, 99, 1)',
              boxShadow: '5px 5px 0px  rgba(0, 0, 0, 1)',
              border: '2px solid rgba(0, 0, 0, 1)',
              padding: '30px',
              overflow: "visible",
              // @ts-ignore
              "&:hover": {
                boxShadow: 'none',
              }
            }
          }}
        >
          <div className=' absolute w-[76px] h-[69px] top-[-20px] left-[30px]'>
            <Image src="/mail_modal_ill.png" fill alt='mail modal' priority />
          </div>

          <h3 className=' text-[18px] leading-[24px] font-semibold text-white font-Inter mb-[20px] mt-[20px]'>{t('email_modal_title')}</h3>

          <div className='flex justify-between'>
            <Input placeholder={t('email_modal_input_placeholder')} className='w-[260px] h-[48px] rounded-[24px] bg-black/20 border-none !focus-visible:ring-0 !focus-visible:outline-none active:outline-none focus:outline-none !focus:ring-0 !active:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 outline-none ring-0 border-transparent text-[16px] leading-[16px] font-medium text-white placeholder:text-[16px] placeholder:font-medium placeholder:text-white/30 px-4' ref={secondInputRef}
              onChange={() => {
                if (Boolean(secondInputRef.current?.value) && !isSubmitingEmail) {
                  setSubmitingEmail(true)
                }
                if (!Boolean(secondInputRef.current?.value) && isSubmitingEmail) {
                  setSubmitingEmail(false)
                }
              }} />

            <Button className={clsx(
              "w-[120px] h-[48px] text-[16px] leading-[16px] rounded-full font-normal text-black hover:bg-white",
              secondInputRef.current?.value ? "bg-white" : "bg-white/40"
            )}
              disabled={isSubmitting}
              onClick={() => handleSubmitEmail(secondInputRef)}
            >
              {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {t('email_modal_subscribe')}
            </Button>
          </div>
        </Modal>}

      {/* mobile */}
      {!showChatModal && <div className='absolute z-20 bottom-[30px] sm:hidden'>
        <div className='h-[56px] w-[360px] mx-auto bg-white rounded-[12px] px-[14px] cursor-pointer mb-[10px] border-[2px] border-black shadow-[4px_4px_0px_#000000FF] flex items-end' onClick={() => setShowChatModal(true)}>
          <Image src={"/chat_bot_avatar.png"} alt='chat avatar' width={50} height={65} />
          <span className=' text-[18px] leading-[48px] font-semibold ml-[10px]'>{t('mobile_chat_btn')}</span>
        </div>
        <div className='h-[56px] w-[360px] mx-auto bg-white rounded-[12px] pl-[20px] py-[14px] cursor-pointer inline-flex items-center border-[2px] border-black shadow-[4px_4px_0px_#000000FF]' onClick={() => setShowMainModal(true)}>
          <div className=' w-[40px] h-[28px] rounded-full inline-flex items-center justify-center'>
            <Image src={"/email_icon.png"} alt='email' width="40" height="28" />
          </div>
          <span className='text-[18px] leading-[18px] font-semibold ml-[13px]'>{t('mobile_email_btn')}</span>
        </div>
      </div>}
    </main>
  )
}
