/**
 * FHE Key Management
 *
 * Utilities for managing FHE encryption keys
 */

/**
 * Retrieve public key for a contract
 */
export async function getPublicKey(
  contractAddress: string,
  gatewayUrl?: string
): Promise<{ publicKey: string; keyId: string }> {
  // In a real implementation, this would fetch from the FHE gateway/KMS
  // For now, this is a placeholder

  try {
    const response = await fetch(`/api/keys?contractAddress=${contractAddress}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to retrieve public key');
    }

    return {
      publicKey: data.publicKey,
      keyId: data.keyId
    };
  } catch (error) {
    throw new Error(
      `Failed to retrieve public key: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Register a new key for a contract
 */
export async function registerKey(contractAddress: string): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        contractAddress
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to register key:', error);
    return false;
  }
}

/**
 * Revoke a key for a contract
 */
export async function revokeKey(contractAddress: string): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'revoke',
        contractAddress
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to revoke key:', error);
    return false;
  }
}

/**
 * Generate a new key pair
 */
export async function generateKeyPair(): Promise<boolean> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate'
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to generate key pair:', error);
    return false;
  }
}
