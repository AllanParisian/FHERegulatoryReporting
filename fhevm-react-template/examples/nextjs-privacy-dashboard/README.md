# Next.js Privacy Dashboard

> Example application showcasing `@fhevm-template/sdk` integration with Next.js

## Features

- ✅ **Encryption Demo** - Encrypt values with different data types
- ✅ **Decryption Demo** - User and public decryption examples
- ✅ **React Hooks** - Full SDK hook integration
- ✅ **Responsive UI** - Tailwind CSS styling
- ✅ **TypeScript** - Full type safety

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

## SDK Integration

### Provider Setup

```tsx
import { FhevmProvider } from '@fhevm-template/sdk';

<FhevmProvider config={{ provider, signer }}>
  <App />
</FhevmProvider>
```

### Using Hooks

```tsx
import { useFhevmEncrypt, useFhevmDecrypt } from '@fhevm-template/sdk';

function MyComponent() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();
  const { userDecrypt } = useFhevmDecrypt();

  // Encrypt
  const encrypted = await encrypt(42, 'uint64');

  // Decrypt
  const decrypted = await userDecrypt(contractAddress, handle);
}
```

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [fhEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama fhEVM](https://docs.zama.ai/fhevm)
