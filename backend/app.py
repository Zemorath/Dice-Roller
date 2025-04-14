from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Enable CORS
CORS(app, supports_credentials=True, origins=["https://dice-roller-frontend.onrender.com"])

# Configure Flask session (cookie-based)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

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
    logger.debug("Entering /save-roll endpoint")
    logger.debug(f"Session before setting sid: {session}")
    if 'sid' not in session:
        session['sid'] = os.urandom(24).hex()
        logger.debug(f"Set new session sid: {session['sid']}")
    else:
        logger.debug(f"Existing session sid: {session['sid']}")

    data = request.json
    dice = data.get('dice')
    result = data.get('result')

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO rolls (session_id, dice, result, timestamp) VALUES (?, ?, ?, ?)",
              (session['sid'], dice, str(result), datetime.now().isoformat()))
    conn.commit()
    conn.close()

    logger.debug(f"Returning response with session_id: {session['sid']}")
    return jsonify({"message": "Roll saved", "session_id": session['sid']})

@app.route('/history', methods=['GET'])
def get_history():
    logger.debug("Entering /history endpoint")
    logger.debug(f"Session: {session}")
    if 'sid' not in session:
        logger.warning("No session ID found")
        return jsonify({"error": "No session found"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT dice, result, timestamp FROM rolls WHERE session_id = ? ORDER BY timestamp DESC",
              (session['sid'],))
    rolls = [{"dice": row[0], "result": eval(row[1]), "timestamp": row[2]} for row in c.fetchall()]
    conn.close()

    logger.debug(f"Returning history: {rolls}")
    return jsonify({"history": rolls})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)