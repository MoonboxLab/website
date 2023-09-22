"use client"
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { ToastContainer } from 'react-toastify';

import { Inter } from 'next/font/google'
import { WagmiProviders } from './wagmiProvider'
import Header from '@/components/Header';

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
      </body>
    </html>
  )
}
