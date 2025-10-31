'use client';

import { useState } from 'react';
import { useFhevmEncrypt } from '@fhevm-template/sdk';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Medical Example Component
 *
 * Demonstrates FHE usage in healthcare applications
 */
export function MedicalExample() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEncryptVitals = async () => {
    if (!heartRate || !bloodPressure) {
      setError('Please enter both heart rate and blood pressure');
      return;
    }

    if (isNaN(Number(heartRate)) || isNaN(Number(bloodPressure))) {
      setError('Please enter valid numeric values');
      return;
    }

    setError(null);

    try {
      // Encrypt both values
      const encryptedHR = await encrypt(Number(heartRate), 'uint16');
      const encryptedBP = await encrypt(Number(bloodPressure), 'uint16');

      setEncryptedData({
        originalHeartRate: heartRate,
        originalBloodPressure: bloodPressure,
        encryptedHeartRate: encryptedHR.data,
        encryptedBloodPressure: encryptedBP.data,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  const handleReset = () => {
    setHeartRate('');
    setBloodPressure('');
    setEncryptedData(null);
    setError(null);
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>🏥 Private Medical Records</CardTitle>
        <CardDescription>
          Encrypt sensitive health data using FHE
        </CardDescription>
      </CardHeader>

      <CardBody>
        <div className="space-y-6">
          {/* Health Metrics Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Heart Rate (bpm)"
              placeholder="e.g., 72"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              helperText="Normal: 60-100 bpm"
            />

            <Input
              type="number"
              label="Blood Pressure (systolic)"
              placeholder="e.g., 120"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              helperText="Normal: 90-120 mmHg"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleEncryptVitals}
              isLoading={isEncrypting}
              disabled={!heartRate || !bloodPressure}
              className="flex-1"
            >
              Encrypt Vital Signs
            </Button>

            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={!heartRate && !bloodPressure && !encryptedData}
            >
              Reset
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {encryptedData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <p className="text-sm font-medium text-green-800">
                Medical Data Encrypted Successfully
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Heart Rate
                  </p>
                  <p className="text-xs text-green-700">
                    Original: {encryptedData.originalHeartRate} bpm
                  </p>
                  <p className="text-xs text-gray-500 break-all mt-1">
                    Encrypted: {JSON.stringify(encryptedData.encryptedHeartRate).substring(0, 50)}...
                  </p>
                </div>

                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Blood Pressure
                  </p>
                  <p className="text-xs text-green-700">
                    Original: {encryptedData.originalBloodPressure} mmHg
                  </p>
                  <p className="text-xs text-gray-500 break-all mt-1">
                    Encrypted: {JSON.stringify(encryptedData.encryptedBloodPressure).substring(0, 50)}...
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Timestamp: {new Date(encryptedData.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {/* Use Cases */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              Healthcare Use Cases
            </h4>
            <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
              <li>Private medical records on blockchain</li>
              <li>Encrypted patient vital signs and test results</li>
              <li>Confidential prescription and medication data</li>
              <li>Privacy-preserving clinical trials</li>
              <li>Secure multi-institution data sharing</li>
              <li>Anonymous health research with encrypted data</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
