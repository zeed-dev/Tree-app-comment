import { useState, useEffect } from 'react';
import { type StartingNumber, calculationAPI } from '../../services/api';
import { StartingNumberCard } from './StartingNumberCard';
import { StartingNumberForm } from './StartingNumberForm';
import { useAuth } from '../../contexts/AuthContext';
import './CalculationTree.css';

export function CalculationTree() {
  const [startingNumbers, setStartingNumbers] = useState<StartingNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadStartingNumbers();
  }, []);

  const loadStartingNumbers = async () => {
    try {
      setLoading(true);
      const numbers = await calculationAPI.getAllStartingNumbers();
      setStartingNumbers(numbers);
    } catch (error) {
      console.error('Error loading starting numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartingNumberCreated = () => {
    loadStartingNumbers();
    setShowForm(false);
  };

  return (
    <div className="calculation-tree">
      <div className="tree-header">
        <h1>Calculation Tree</h1>
        {isAuthenticated && (
          <button onClick={() => setShowForm(!showForm)} className="create-button">
            {showForm ? 'Cancel' : 'Create Starting Number'}
          </button>
        )}
      </div>

      {showForm && <StartingNumberForm onStartingNumberCreated={handleStartingNumberCreated} />}

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#64748b',
          fontSize: '1.125rem'
        }}>
          Loading calculations...
        </div>
      )}
      {startingNumbers.length === 0 && !loading && (
        <div className="empty-state">No starting numbers yet. Be the first to create one!</div>
      )}
      {startingNumbers.map((startingNumber) => (
        <StartingNumberCard key={startingNumber.id} startingNumber={startingNumber} />
      ))}
    </div>
  );
}

