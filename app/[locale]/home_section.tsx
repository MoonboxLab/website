"use client"
import Modal from 'react-modal'
import ReactPlayer from "react-player";
import Image from "next/image";
import { useLocalStorageState, useSize } from "ahooks";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { RefObject, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next-intl/client";
import { useChat } from 'ai/react';
import BotMessageItem from "@/components/BotMessageItem";
import UserMessageItem from "@/components/UserMessageItem";
import { track } from "@vercel/analytics/react";

interface FirstSectionProps {
  showChatModal: boolean,
  setShowChatModal: (arg: boolean) => any
}
export default function FirstSection(props: FirstSectionProps) {
  const { showChatModal, setShowChatModal } = props

  const mediaSize = useSize(document.querySelector('body'));
  const t = useTranslations('Home');

  const playerRef = useRef<ReactPlayer>();
  const inputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [showMainModal, setShowMainModal] = useState<boolean>(false);
  const [showSecondModal, setShowSecondModal] = useState<boolean>(true);
  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

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
      var captcha = new TencentCaptcha("189994500", (res) => {
        console.log(res)
        if (res.ret == 0) {
          submitEmail(inputEmail)
          sendWeclomeEmailToUser(inputEmail, res);
        }
      }, {
        userLanguage: locale == 'en' ? "en" : 'zh-cn'
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

  return <div className='section relative w-full h-screen'>
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

    {!playingMedia && !showMainModal && !showChatModal && (mediaSize?.width || 0) > 640 &&
      <div className=' absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[96px] w-[96px] rounded-full bg-black/80 inline-flex items-center justify-center border-[4px] cursor-pointer z-[120] ' onClick={() => {
        setPlayingMedia(true)
      }}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6577" width="36" height="36"><path d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z" fill="#ffffff" p-id="6578"></path></svg>
      </div>}

    {playingMedia && <div className={clsx('absolute z-[11] cursor-pointer w-[64px] h-[64px] rounded-full right-[40px] bottom-[40px] inline-flex items-center justify-center bg-white/30')} onClick={() => setVidoeMuted(!isMuted)}>
      {isMuted ?
        <Image priority src={"/video_music_muted.png"} alt='volumn_switch_muted' width={40} height={40} /> :
        <Image priority src={"/video_music.gif"} alt='volumn_switch' width={40} height={40} />}
    </div>}
    {/* </div> */}

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

                // if (!isSubmitedEmail) {
                //   setShowMainModal(true);
                // }
                setShowChatModal(true);
              }}
              width="100%"
              height="auto"
              url={"/video_home.mp4"}
            />}
        </AspectRatio>
      </div>
    </div>

    {/* PC small modal */}
    {
      !playingMedia && !showMainModal && !showChatModal && (mediaSize?.width || 0) > 640 && showSecondModal &&
      <div className=' absolute z-[110] bottom-[20px] left-[20px] w-[450px] h-[200px] rounded-[16px] bg-[rgba(77,88,99,1)] shadow-[5px_5px_0px_rgba(0,0,0,1)] border-[2px] border-black p-[30px] overflow-visible hover-btn-shadow'>
        <div className=' absolute w-[76px] h-[69px] top-[-23px] left-[30px]'>
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
            "w-[120px] h-[48px] text-[16px] leading-[16px] rounded-full font-normal text-black",
            secondInputRef.current?.value ? "bg-white hover:bg-white" : "bg-white/40 hover:bg-white/40"
          )}
            disabled={isSubmitting}
            onClick={() => handleSubmitEmail(secondInputRef)}
          >
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {t('email_modal_subscribe')}
          </Button>
        </div>
      </div>
    }

    {/* mobile */}
    {!showChatModal &&
      <div className='absolute z-20 bottom-[30px] sm:hidden left-0 right-0'>
        <div className='h-[56px] w-[360px] mx-auto bg-white rounded-[12px] px-[14px] cursor-pointer mb-[10px] border-[2px] border-black shadow-[4px_4px_0px_#000000FF] flex items-end' onClick={() => setShowChatModal(true)}>
          <Image src={"/chat_bot_avatar.png"} alt='chat avatar' width={50} height={65} />
          <span className=' text-[18px] leading-[48px] font-semibold ml-[10px]'>{t('mobile_chat_btn')}</span>
        </div>
        <div className='h-[56px] w-[360px] mx-auto bg-white rounded-[12px] pl-[20px] py-[14px] cursor-pointer flex items-center border-[2px] border-black shadow-[4px_4px_0px_#000000FF]' onClick={() => setShowMainModal(true)}>
          <div className=' w-[40px] h-[28px] rounded-full inline-flex items-center justify-center'>
            <Image src={"/email_icon.png"} alt='email' width="40" height="28" />
          </div>
          <span className='text-[18px] leading-[18px] font-semibold ml-[13px]'>{t('mobile_email_btn')}</span>
        </div>
      </div>}

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
          width: (mediaSize?.width || 0) > 640 ? (mediaSize?.width || 0) > 1800 ? "932px" : '832px' : '92%',
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
      <div className='h-[84%] sm:h-[92%] min-h-[200px] overflow-y-scroll hide-scrollbar' ref={chatListBottomRef}>
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
      <div className=' hidden sm:flex justify-center mt-[40px]' >
        <div
          onClick={() => { setShowChatModal(false) }}
          className='text-[18px] leading-[18px] font-normal text-white w-[190px] h-[48px] rounded-[24px] bg-white/10 border-white/20 border-[1px] inline-flex items-center justify-center cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.5)]'>{t('chat_modal_closeBtn')}</div>
      </div>
    </Modal>
  </div>
}