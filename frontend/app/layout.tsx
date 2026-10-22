import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Claim-Check MCP - Epistemic Safety for Alexa+',
  description: 'Voice-first atomic claim decomposition, self-correction, and calibrated abstention over MCP.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
