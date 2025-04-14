from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Enable CORS
CORS(app, supports_credentials=True, origins=["https://dice-roller-frontend.onrender.com"])

# Configure session to use SQLAlchemy
app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////app/db/sessions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'
db = SQLAlchemy(app)
app.config['SESSION_SQLALCHEMY'] = db
Session(app)

# SQLite database setup for rolls
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
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)