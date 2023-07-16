import { ReduxProvider } from '@/store/provider'
import './globals.css'
import { League_Spartan } from 'next/font/google'


const spartan = League_Spartan({ subsets: ['latin'] })

export const metadata = {
  title: 'invoice app',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={spartan.className}>
          <ReduxProvider>
              {children}
          </ReduxProvider>
      </body>
    </html>
  )
}
