import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './NavBar'
import "@radix-ui/themes/styles.css";
import { Container, Theme } from "@radix-ui/themes";
import './theme-config.css';
import Authprovider from './auth/provider';
import QueryClientProvider from './QueryClientProvider';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <QueryClientProvider>
          <Authprovider>
            <Theme grayColor="gray" radius="none">
              <NavBar />
              <main className='p-4'>
                <Container>
                  {children}
                  <Toaster />
                </Container>
              </main>
            </Theme>
          </Authprovider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
