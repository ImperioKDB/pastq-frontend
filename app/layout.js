import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'PastQ — Past Questions for Nigerian Students',
  description: 'AI-powered past question bank for Nigerian university students. Search, practice, and ace your exams.',
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
