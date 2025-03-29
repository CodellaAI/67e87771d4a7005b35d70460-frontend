
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/auth/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata = {
  title: 'Matan Elbaz - Premium Barbershop',
  description: 'Book your premium haircut experience at Matan Elbaz Barbershop',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-black-900 text-white">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#191919',
                color: '#fff',
                border: '1px solid #F5C311',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
