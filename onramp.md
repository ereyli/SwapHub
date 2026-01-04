You are a senior Web3 frontend engineer experienced with:
- React + TypeScript
- wagmi + RainbowKit
- Farcaster MiniApps
- Coinbase Developer Platform (Onramp)

GOAL:
Integrate Coinbase Onramp into an existing DEX frontend WITHOUT changing the current wallet connection logic.

IMPORTANT CONSTRAINTS:
- DO NOT use Coinbase Wallet SDK
- DO NOT require users to connect Coinbase Wallet
- Use the ALREADY connected wallet address (wagmi useAccount)
- Coinbase Onramp is ONLY used as a fiat → crypto gateway
- Existing swap contracts and fee logic MUST remain unchanged

CURRENT SETUP:
- Wallet connection via wagmi + RainbowKit
- User wallet address is already available (address)
- Network: Base
- Swap aggregator expects USDC or ETH in the user wallet
- After onramp, user will manually or automatically swap using our aggregator

TASKS:

1. Add a “Buy with Card” button to the UI
   - Visible only if user is connected
   - Label example: “Kartla Al (USDC)”

2. When clicked:
   - Open Coinbase Onramp using the EMBED or REDIRECT flow
   - Use Coinbase Onramp SDK or URL-based integration
   - Pass the following parameters:
     - destinationWalletAddress = connected wallet address
     - destinationChain = "base"
     - destinationAsset = "USDC"
     - presetFiatAmount (optional)
     - redirectUrl (optional, for redirect flow)

3. DO NOT add any new wallet connection logic
   - No Coinbase Wallet
   - No Wallet SDK
   - No extra approval steps

4. Handle success flow:
   - After onramp completes, user returns to app
   - Show message like:
     “USDC cüzdanına ulaştı. Takas edebilirsin.”
   - Optionally trigger a USDC balance refetch

5. Provide:
   - A clean React component (BuyWithCard.tsx)
   - Example Onramp initialization code
   - Minimal styling (compatible with dark UI)
   - Comments explaining each step

DOCUMENTATION REFERENCES (USE THESE):
- Coinbase Onramp Overview:
  https://docs.cdp.coinbase.com/onramp/docs/overview

- Embed Onramp:
  https://docs.cdp.coinbase.com/onramp/docs/embed-onramp

- Redirect Onramp:
  https://docs.cdp.coinbase.com/onramp/docs/redirect-onramp

- Supported Countries & Assets:
  https://docs.cdp.coinbase.com/onramp/docs/supported-countries

FINAL NOTES:
- Treat Coinbase Onramp as a third-party fiat provider
- The app’s monetization remains entirely in the swap aggregator
- Keep the integration simple, explicit, and auditable
