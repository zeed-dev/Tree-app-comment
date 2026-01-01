import { useState } from 'react';
import { calculationAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface OperationFormProps {
  parentId: number;
  parentType: 'starting_number' | 'operation';
  onOperationCreated: () => void;
}

export function OperationForm({ parentId, parentType, onOperationCreated }: OperationFormProps) {
  const [operationType, setOperationType] = useState<'+' | '-' | '*' | '/'>('+');
  const [rightOperand, setRightOperand] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div style={{ color: 'red', padding: '10px' }}>Please login to add operations</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numValue = parseFloat(rightOperand);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);
    try {
      await calculationAPI.createOperation(parentId, parentType, operationType, numValue);
      setRightOperand('');
      onOperationCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="operation-form">
      <div className="form-group">
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as '+' | '-' | '*' | '/')}
          className="operation-select"
        >
          <option value="+">+ (Add)</option>
          <option value="-">- (Subtract)</option>
          <option value="*">× (Multiply)</option>
          <option value="/">÷ (Divide)</option>
        </select>
        <input
          type="number"
          step="any"
          value={rightOperand}
          onChange={(e) => setRightOperand(e.target.value)}
          placeholder="Right operand"
          required
          className="operand-input"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}

