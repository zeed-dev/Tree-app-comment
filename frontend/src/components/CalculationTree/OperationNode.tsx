import { useState, useEffect } from 'react';
import { type Operation, calculationAPI } from '../../services/api';
import { OperationForm } from './OperationForm';
import './CalculationTree.css';

interface OperationNodeProps {
  operation: Operation;
  level: number;
}

export function OperationNode({ operation, level }: OperationNodeProps) {
  const [childOperations, setChildOperations] = useState<Operation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [_, setLoading] = useState(false)

  useEffect(() => {
    loadChildOperations();
  }, []);

  const loadChildOperations = async () => {
    try {
      setLoading(true);
      const operations = await calculationAPI.getOperationsByParent('operation', operation.id);
      setChildOperations(operations);
    } catch (error) {
      console.error('Error loading child operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOperationCreated = () => {
    loadChildOperations();
    setShowForm(false);
  };

  const formatResult = (result?: number) => {
    if (result === undefined || result === null) return 'Calculating...';
    if (isNaN(result)) return 'Error';
    return result.toFixed(2);
  };

  return (
    <div className="operation-node" style={{ marginLeft: `${level * 30}px` }}>
      <div className="operation-card">
        <div className="operation-header">
          <span className="operation-type">{operation.operationType}</span>
          <span className="operation-value">{operation.rightOperand}</span>
          <span className="operation-result">= {formatResult(operation.result)}</span>
        </div>
        <div className="operation-meta">
          <span>by {operation.username}</span>
          <span>{new Date(operation.createdAt).toLocaleString()}</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="reply-button"
        >
          {showForm ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {showForm && (
        <OperationForm
          parentId={operation.id}
          parentType="operation"
          onOperationCreated={handleOperationCreated}
        />
      )}

      {childOperations.map((childOp) => (
        <OperationNode key={childOp.id} operation={childOp} level={level + 1} />
      ))}
    </div>
  );
}

