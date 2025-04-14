import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ThemeContext, ThemeProvider } from './ThemeContext';
import StatsPage from './StatsPage';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
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
      if (!rollResponse.ok) {
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
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col items-center p-4 transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Updated Navigation */}
        <nav className="mb-6 flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-lg"
          >
            Roller
          </Link>
          <Link
            to="/stats"
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-lg"
          >
            Stats
          </Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-dark-text">TTRPG Dice Roller</h1>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={diceInput}
                    onChange={(e) => setDiceInput(e.target.value)}
                    placeholder="e.g., 2d6"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                  />
                  <button
                    onClick={rollDice}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Roll
                  </button>
                </div>
                {rollResult && (
                  <div className="mb-4">
                    <p className="text-lg text-gray-700 dark:text-dark-text">
                      Rolls: {rollResult.rolls.join(', ')} | Total: {rollResult.total}
                    </p>
                  </div>
                )}
                <div className="w-full max-w-2xl">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-dark-text">Roll History</h2>
                  {history.length > 0 ? (
                    <ul className="space-y-2">
                      {history.map((roll, index) => (
                        <li key={index} className="bg-white dark:bg-dark-card p-2 rounded shadow dark:text-dark-text">
                          {roll.dice}: {roll.result.rolls.join(', ')} (Total: {roll.result.total}) - {roll.timestamp}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-dark-text">No rolls yet!</p>
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