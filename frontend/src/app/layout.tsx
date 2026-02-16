import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ICE SPOT POS',
  description: 'Fast billing counter POS for ice cream shops',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
