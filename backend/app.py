from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS  # Add this import
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# Enable CORS for all routes, allowing credentials
CORS(app, supports_credentials=True)

# Configure session to use filesystem
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'your-secret-key-here'
Session(app)

# SQLite database setup (unchanged)
DB_PATH = os.path.join(os.path.dirname(__file__), 'db', 'rolls.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS rolls
                 (session_id TEXT, dice TEXT, result TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

@app.route('/save-roll', methods=['POST'])
def save_roll():
    if 'sid' not in session:
        session['sid'] = os.urandom(24).hex()
    data = request.json
    dice = data.get('dice')
    result = data.get('result')

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO rolls (session_id, dice, result, timestamp) VALUES (?, ?, ?, ?)",
              (session['sid'], dice, str(result), datetime.now().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({"message": "Roll saved", "session_id": session['sid']})

@app.route('/history', methods=['GET'])
def get_history():
    if 'sid' not in session:
        return jsonify({"error": "No session found"}), 400

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT dice, result, timestamp FROM rolls WHERE session_id = ? ORDER BY timestamp DESC",
              (session['sid'],))
    rolls = [{"dice": row[0], "result": eval(row[1]), "timestamp": row[2]} for row in c.fetchall()]
    conn.close()

    return jsonify({"history": rolls})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)