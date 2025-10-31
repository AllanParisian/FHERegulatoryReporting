import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

/**
 * Decryption API Route
 *
 * Decrypts FHE encrypted data (requires proper authorization)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, contractAddress, userAddress, rpcUrl, privateKey, isPublic } = body;

    // Validate inputs
    if (!handle) {
      return NextResponse.json(
        { error: 'Handle is required' },
        { status: 400 }
      );
    }

    // Create FHE client
    const provider = new ethers.JsonRpcProvider(rpcUrl || process.env.NEXT_PUBLIC_RPC_URL);

    const wallet = privateKey
      ? new ethers.Wallet(privateKey, provider)
      : ethers.Wallet.createRandom(provider);

    const client = await createFhevmClient({
      provider,
      signer: wallet
    });

    let decrypted;

    if (isPublic) {
      // Public decryption (no signature required)
      decrypted = await client.publicDecrypt(handle);
    } else {
      // User decryption (requires signature and authorization)
      if (!contractAddress) {
        return NextResponse.json(
          { error: 'Contract address is required for user decryption' },
          { status: 400 }
        );
      }

      decrypted = await client.userDecrypt(contractAddress, handle);
    }

    return NextResponse.json({
      success: true,
      decrypted: decrypted.toString(),
      type: isPublic ? 'public' : 'user'
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      {
        error: 'Decryption failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Return decryption information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/decrypt',
    method: 'POST',
    description: 'Decrypts FHE encrypted data with proper authorization',
    parameters: {
      handle: 'The encryption handle to decrypt',
      contractAddress: 'Contract address (required for user decryption)',
      userAddress: 'User address for authorization',
      isPublic: 'Whether this is public decryption (no signature required)',
      rpcUrl: '(Optional) RPC URL for the network',
      privateKey: '(Optional) Private key for signing'
    },
    note: 'User decryption requires proper authorization via EIP-712 signature'
  });
}
