import './globals.css';

export const metadata = {
  title: 'PastQ — Nigerian University Past Questions',
  description: 'Find and practice past exam questions from Nigerian universities',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
