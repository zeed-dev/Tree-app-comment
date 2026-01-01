import { useState } from 'react';
import { calculationAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface StartingNumberFormProps {
  onStartingNumberCreated: () => void;
}

export function StartingNumberForm({ onStartingNumberCreated }: StartingNumberFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div style={{ color: 'red', padding: '10px' }}>Please login to create starting numbers</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);
    try {
      await calculationAPI.createStartingNumber(numValue);
      setValue('');
      onStartingNumberCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create starting number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="starting-number-form">
      <div className="form-group">
        <label style={{ fontWeight: 500, color: '#475569', marginBottom: '0.5rem', display: 'block' }}>
          Starting Number
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            required
            className="value-input"
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}

