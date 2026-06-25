import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title:       'PastQ — Past Questions for Nigerian Students',
  description: 'AI-powered past question bank for Nigerian university students. Search, practice, and ace your exams.',
  keywords:    ['past questions', 'Nigeria', 'university', 'UNIBEN', 'exam prep'],
  openGraph: {
    title:       'PastQ — Every Past Question, One Place',
    description: '10,000+ past questions from Nigerian universities. Practice until you stop losing marks.',
    type:        'website',
    locale:      'en_NG',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'PastQ — Past Questions for Nigerian Students',
    description: 'AI-powered past question bank. Search, practice, ace.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0C0A09" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
