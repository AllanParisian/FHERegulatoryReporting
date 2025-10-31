import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

/**
 * Encryption API Route
 *
 * Encrypts data using FHE
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type, rpcUrl, privateKey } = body;

    // Validate inputs
    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required (uint8, uint16, uint32, uint64, address, bool)' },
        { status: 400 }
      );
    }

    // Create FHE client
    const provider = new ethers.JsonRpcProvider(rpcUrl || process.env.NEXT_PUBLIC_RPC_URL);

    // For server-side operations, you might use a different approach
    // This is a demonstration - in production, encryption should happen client-side
    const wallet = privateKey
      ? new ethers.Wallet(privateKey, provider)
      : ethers.Wallet.createRandom(provider);

    const client = await createFhevmClient({
      provider,
      signer: wallet
    });

    // Encrypt the value
    const encrypted = await client.encrypt(value, type as any);

    return NextResponse.json({
      success: true,
      encrypted: {
        data: encrypted.data,
        type: type
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        error: 'Encryption failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Return encryption information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/encrypt',
    method: 'POST',
    description: 'Encrypts data using FHE',
    supportedTypes: ['uint8', 'uint16', 'uint32', 'uint64', 'address', 'bool'],
    parameters: {
      value: 'The value to encrypt',
      type: 'The data type (uint8, uint16, uint32, uint64, address, bool)',
      rpcUrl: '(Optional) RPC URL for the network',
      privateKey: '(Optional) Private key for signing'
    }
  });
}
