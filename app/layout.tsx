// "use client"
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Analytics } from '@vercel/analytics/react';

import { ToastContainer } from 'react-toastify';

import { Inter } from 'next/font/google'
import { WagmiProviders } from './wagmiProvider'
import Header from '@/components/Header';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ToastContainer />
        <WagmiProviders>
          {/* <Header /> */}
          {children}
        </WagmiProviders>
        <Analytics />
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
    card: 'summary_large_image',
    title: 'Moonbox',
    description: 'Bring life to NFTs',
    images: ['/twitter_card_image.gif'],
  },
}