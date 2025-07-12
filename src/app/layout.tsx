"use client"

import { BrowserRouter } from 'react-router-dom';
import './globals.css';
// import './temp.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </body>
    </html>
  );
}