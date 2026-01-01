import { useState, useEffect } from 'react';
import { type StartingNumber, type Operation, calculationAPI } from '../../services/api';
import { OperationForm } from './OperationForm';
import { OperationNode } from './OperationNode';
import './CalculationTree.css';

interface StartingNumberCardProps {
  startingNumber: StartingNumber;
}

export function StartingNumberCard({ startingNumber }: StartingNumberCardProps) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const ops = await calculationAPI.getOperationsByParent('starting_number', startingNumber.id);
      setOperations(ops);
    } catch (error) {
      console.error('Error loading operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOperationCreated = () => {
    loadOperations();
    setShowForm(false);
  };

  return (
    <div className="starting-number-card">
      <div className="starting-number-header">
        <h3>Starting Number: {startingNumber.value}</h3>
        <div className="starting-number-meta">
          <span>by {startingNumber.username}</span>
          <span>{new Date(startingNumber.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="reply-button"
      >
        {showForm ? 'Cancel' : 'Add Operation'}
      </button>

      {showForm && (
        <OperationForm
          parentId={startingNumber.id}
          parentType="starting_number"
          onOperationCreated={handleOperationCreated}
        />
      )}

      {loading && <div>Loading operations...</div>}
      {operations.map((operation) => (
        <OperationNode key={operation.id} operation={operation} level={0} />
      ))}
    </div>
  );
}

