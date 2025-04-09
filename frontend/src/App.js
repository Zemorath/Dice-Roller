import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StatsPage from './StatsPage'; // We’ll create this next

function App() {
  const [diceInput, setDiceInput] = useState('');
  const [rollResult, setRollResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const rollDice = async () => {
    if (!diceInput.match(/^\d+d\d+$/)) {
      alert('Invalid format. Use NdM (e.g., 2d6)');
      return;
    }

    try {
      const rollResponse = await fetch(`http://localhost:8080/roll/${diceInput}`);
      if (!rollResponse.ok) {
        throw new Error(`Go API error: ${rollResponse.status} ${rollResponse.statusText}`);
      }
      const rollData = await rollResponse.json();
      setRollResult(rollData);

      const saveResponse = await fetch('http://localhost:5000/save-roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dice: diceInput, result: rollData }),
        credentials: 'include',
      });
      if (!saveResponse.ok) {
        throw new Error(`Flask backend error: ${saveResponse.status} ${saveResponse.statusText}`);
      }
      await saveResponse.json();

      await fetchHistory();
    } catch (error) {
      console.error('Error in rollDice:', error);
      alert(`Failed to roll dice: ${error.message}`);
    }
  };

  const fetchHistory = async () => {
    try {
      const historyResponse = await fetch('http://localhost:5000/history', {
        credentials: 'include',
      });
      const historyData = await historyResponse.json();
      if (historyData.history) {
        setHistory(historyData.history);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistory([]);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <nav className="mb-6">
          <Link to="/" className="mr-4 text-blue-500 hover:underline">Roller</Link>
          <Link to="/stats" className="text-blue-500 hover:underline">Stats</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl font-bold mb-6">TTRPG Dice Roller</h1>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={diceInput}
                    onChange={(e) => setDiceInput(e.target.value)}
                    placeholder="e.g., 2d6"
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={rollDice}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Roll
                  </button>
                </div>
                {rollResult && (
                  <div className="mb-4">
                    <p className="text-lg">
                      Rolls: {rollResult.rolls.join(', ')} | Total: {rollResult.total}
                    </p>
                  </div>
                )}
                <div className="w-full max-w-2xl">
                  <h2 className="text-xl font-semibold mb-2">Roll History</h2>
                  {history.length > 0 ? (
                    <ul className="space-y-2">
                      {history.map((roll, index) => (
                        <li key={index} className="bg-white p-2 rounded shadow">
                          {roll.dice}: {roll.result.rolls.join(', ')} (Total: {roll.result.total}) - {roll.timestamp}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No rolls yet!</p>
                  )}
                </div>
              </>
            }
          />
          <Route path="/stats" element={<StatsPage history={history} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;