import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: "Loler's Hustle",
  description: 'Your one-stop shop for enchanted Minecraft items.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('antialiased min-h-screen bg-background')}>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
