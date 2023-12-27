// "use client"
import '../globals.css'
import 'core-js/features/object/has-own';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from 'react-toastify';

import { Inter } from 'next/font/google'
import { WagmiProviders } from '../provider'
import Header from '@/components/Header_Backup';
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
  params: { locale: string }
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
        <script async src="https://ca.turing.captcha.qcloud.com/TCaptcha-global.js"></script>
        {/* <script async src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script> */}
        {/* <script async src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script> */}
        {/* <Script id='vconsole' async>
          var vConsole = new window.VConsole();
        </Script> */}
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
    images: '/open-graph.jpg',
    url: "https://moonbox.com"
  },
  twitter: {
    card: "summary_large_image",
    title: 'Moonbox',
    description: 'Bring life to NFTs',
    images: ['https://moonbox.com/open-graph.jpg'],
  },
}