// "use client"
import '../globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Analytics } from '@vercel/analytics/react';

import { ToastContainer } from 'react-toastify';

import { Inter } from 'next/font/google'
import { WagmiProviders } from '../wagmiProvider'
import Header from '@/components/Header';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children, params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string}
}) {

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className}`}>
        <ToastContainer />
        <WagmiProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* <Header /> */}
            {children}
          </NextIntlClientProvider>
        </WagmiProviders>
        <Analytics />
        {/* <!-- 动态引入验证码JS示例 --> */}
        {/* <script async src="https://sg.captcha.qcloud.com/TCaptcha-global.js"></script> */}
        <script async src="https://ca.turing.captcha.qcloud.com/TCaptcha-global.js"></script> 
        <script async src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Moonbox',
  description: 'Bring life to NFTs',
  openGraph: {
    title: 'Moonbox',
    description: 'Bring life to NFTs',
    type: "website",
    images: '/home_video_cover.png',
    url: "https://moonbox.com"
  },
  twitter: {
    card: "summary_large_image",
    title: 'Moonbox',
    description: 'Bring life to NFTs',
    images: ['https://moonbox.com/home_video_cover.png'],
    // players: {
    //   playerUrl: "https://nft-website-git-dev-moonbox.vercel.app/video_home.mp4",
    //   streamUrl: "https://nft-website-git-dev-moonbox.vercel.app/video_home.mp4",
    //   width: 1920,
    //   height: 1080,
    // }
  },
}