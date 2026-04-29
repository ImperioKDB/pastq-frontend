import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'PastQ',
  description: 'AI-powered past questions bank for Nigerian university students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
