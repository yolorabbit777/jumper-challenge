'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, bsc, arbitrum } from '@reown/appkit/networks'

const projectId = '11aa8bbd07788e08507a88ca012ad3ae'

const metadata = {
  name: 'Li.Fi ERC20 Token Dashboard',
  description: 'Li.Fi Technical Challenge',
  url: 'https://localhost:3000',
  icons: []
}

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, bsc, arbitrum],
  projectId,
  features: {
    analytics: true
  }
})

export const AppKitProvider = ({ children } : Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            {children}
        </>
    )
}