import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from '@/components/Layout/Header';
import { AppProvider } from '@/context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Li.Fi Technical Challenge",
  description: "ERC20 Token Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: '0px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppRouterCacheProvider>
          <AppProvider>
            <Header />
            {children}
          </AppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
