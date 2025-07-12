"use client"

import { BrowserRouter } from 'react-router-dom';
import './globals.css';
import ClientOnly from '@/components/ClientOnly';
// import './temp.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ClientOnly>

        <script src='./main.js'/>
      </body>
    </html>
  );
}