# Documentation Index

> Complete documentation for the fhEVM Universal SDK

---

## 📚 Documentation Structure

### Core Documentation

- **[API Reference](./api.md)** - Complete API documentation with all methods, types, and examples
- **[Migration Guide](./migration.md)** - Guide for migrating from fhEVM 1.x to SDK 2.0
- **[Code Examples](./examples.md)** - Practical examples for common use cases

### Getting Started

- **[Main README](../README.md)** - Project overview and quick start
- **[Quick Start Guide](../QUICK_START.md)** - Get up and running in 5 minutes
- **[SDK README](../packages/fhevm-sdk/README.md)** - SDK package documentation

### Examples

- **[Next.js Privacy Dashboard](../examples/nextjs-privacy-dashboard/README.md)** - Complete Next.js application
- **[Privacy Regulatory Reporting](../examples/privacy-regulatory-reporting/README.md)** - Production dApp example

### Additional Resources

- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
- **[Competition Submission](../COMPETITION_SUBMISSION.md)** - Bounty program details
- **[Project Completion Summary](../PROJECT_COMPLETION_SUMMARY.md)** - Complete project overview

---

## 🚀 Quick Links

### I want to...

**Get started quickly**
→ [Quick Start Guide](../QUICK_START.md)

**Understand the API**
→ [API Reference](./api.md)

**See code examples**
→ [Code Examples](./examples.md)

**Migrate from old fhEVM**
→ [Migration Guide](./migration.md)

**Build with React**
→ [Next.js Example](../examples/nextjs-privacy-dashboard/)

**See a production dApp**
→ [Privacy Reporting Example](https://github.com/AllanParisian/FHERegulatoryReporting)

**Contribute to the project**
→ [Contributing Guide](../CONTRIBUTING.md)

---

## 📖 Documentation by Topic

### Installation & Setup

- [Installation instructions](../README.md#installation--setup)
- [Environment configuration](../README.md#prerequisites)
- [Building from source](../CONTRIBUTING.md#setup)

### Core Concepts

- [Framework-agnostic design](../README.md#core-concept)
- [Wagmi-like API](../README.md#core-sdk-features)
- [FHE encryption/decryption](./api.md#fhevmclient-class)

### SDK Usage

- [Creating a client](./api.md#createfhevmclient)
- [Encryption utilities](./api.md#encryption-utilities)
- [Decryption utilities](./api.md#decryption-utilities)
- [EIP-712 signing](./api.md#eip-712-signing)

### React Integration

- [FhevmProvider](./api.md#fhevmprovider)
- [useFhevm hook](./api.md#usefhevm)
- [useFhevmEncrypt hook](./api.md#usefhevmencrypt)
- [useFhevmDecrypt hook](./api.md#usefhevmdecrypt)
- [useFhevmContract hook](./api.md#usefhevmcontract)

### Smart Contracts

- [Contract integration](./examples.md#smart-contract-integration)
- [Deployment](./examples.md#deploy-and-interact)
- [Reading encrypted data](./examples.md#read-encrypted-data)

### Advanced Topics

- [Batch operations](./examples.md#batch-operations)
- [Caching](./examples.md#caching-results)
- [Retry logic](./examples.md#retry-logic)
- [Error handling](./examples.md#error-handling)

### TypeScript

- [Type definitions](./api.md#type-definitions)
- [Error classes](./api.md#error-classes)
- [Full IntelliSense support](../packages/fhevm-sdk/README.md#typescript-support)

---

## 🎯 Documentation by Role

### For Application Developers

**You want to use the SDK in your dApp**

1. Start with [Quick Start Guide](../QUICK_START.md)
2. Review [API Reference](./api.md)
3. Check [Code Examples](./examples.md)
4. See [Next.js Example](../examples/nextjs-privacy-dashboard/)

### For Smart Contract Developers

**You want to build FHE contracts**

1. Review [Privacy Reporting Example](https://github.com/AllanParisian/FHERegulatoryReporting)
2. Check [Contract Integration](./examples.md#smart-contract-integration)
3. See [Deployment Guide](../examples/privacy-regulatory-reporting/README.md)

### For Contributors

**You want to contribute to the SDK**

1. Read [Contributing Guide](../CONTRIBUTING.md)
2. Review [Project Structure](../README.md#monorepo-structure)
3. Check [Development Workflow](../CONTRIBUTING.md#development-workflow)

### For Migrating Users

**You're upgrading from fhEVM 1.x**

1. Follow [Migration Guide](./migration.md)
2. Review [Breaking Changes](./migration.md#breaking-changes)
3. Check [Feature Mapping](./migration.md#feature-mapping)

---

## 💡 Common Use Cases

### Encrypt Data Before Submission

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';

const client = await createFhevmClient({ provider, signer });
const encrypted = await client.encrypt(42, 'uint64');
await contract.submitData(encrypted.data);
```

**Documentation:**
- [Encryption API](./api.md#clientencrypt)
- [Encryption Examples](./examples.md#simple-encryption)

### Decrypt Authorized Data

```typescript
const result = await client.userDecrypt(contractAddress, handle);
if (result.success) {
  console.log('Value:', result.value);
}
```

**Documentation:**
- [Decryption API](./api.md#clientuserdecrypt)
- [Decryption Examples](./examples.md#simple-decryption)

### React Hook Integration

```tsx
import { useFhevmEncrypt } from '@fhevm-template/sdk';

function MyComponent() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();

  const handleSubmit = async () => {
    await encrypt(100, 'uint64');
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

**Documentation:**
- [React Hooks API](./api.md#react-hooks)
- [React Examples](./examples.md#react-examples)

---

## 🔗 External Resources

### Zama fhEVM

- **Documentation**: https://docs.zama.ai/fhevm
- **GitHub**: https://github.com/zama-ai
- **Package**: https://www.npmjs.com/package/fhevm

### Ethereum Development

- **Ethers.js**: https://docs.ethers.org/v6/
- **Hardhat**: https://hardhat.org/docs
- **Solidity**: https://docs.soliditylang.org/

### React & Next.js

- **React**: https://reactjs.org/docs
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📞 Get Help

### Having Issues?

1. Check [Troubleshooting](../README.md#troubleshooting) section
2. Review [Common Issues](./migration.md#troubleshooting)
3. Search [GitHub Issues](https://github.com/AllanParisian/fhevm-react-template/issues)

### Need Support?

- **GitHub Issues**: [Create an issue](https://github.com/AllanParisian/fhevm-react-template/issues)
- **Documentation**: You're here!
- **Examples**: [See code examples](./examples.md)

---

## 📝 Contributing to Docs

Documentation improvements are welcome! See our [Contributing Guide](../CONTRIBUTING.md) for:

- Documentation standards
- Writing style
- Code examples format
- Pull request process

---

**Happy Building with fhEVM SDK!** 🚀
