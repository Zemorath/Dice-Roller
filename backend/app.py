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

# Configure session to use SQLAlchemy with in-memory SQLite
app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
db = SQLAlchemy(app)
app.config['SESSION_SQLALCHEMY'] = db
Session(app)

# Create the sessions table for Flask-SQLAlchemy
with app.app_context():
    db.create_all()
    # Manually create the sessions table if it doesn't exist (Flask-Session requirement)
    db.engine.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE,
            data TEXT,
            expiry DATETIME
        )
    ''')

# In-memory SQLite for rolls
def get_db_connection():
    conn = sqlite3.connect(':memory:', check_same_thread=False)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS rolls
                 (session_id TEXT, dice TEXT, result TEXT, timestamp TEXT)''')
    conn.commit()
    return conn

@app.route('/save-roll', methods=['POST'])
def save_roll():
    if 'sid' not in session:
        session['sid'] = os.urandom(24).hex()
    data = request.json
    dice = data.get('dice')
    result = data.get('result')

    conn = get_db_connection()
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

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT dice, result, timestamp FROM rolls WHERE session_id = ? ORDER BY timestamp DESC",
              (session['sid'],))
    rolls = [{"dice": row[0], "result": eval(row[1]), "timestamp": row[2]} for row in c.fetchall()]
    conn.close()

    return jsonify({"history": rolls})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)