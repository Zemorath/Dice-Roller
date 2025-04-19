<h1>TTRPG Dice Roller</h1>

<p>Welcome to the <strong>TTRPG Dice Roller</strong>, a full-stack web application designed for tabletop RPG players to roll virtual dice and analyze their roll history. Whether you're rolling a d20 for a critical hit or 2d6 for a skill check, this app provides a seamless experience with a polished, user-friendly interface, detailed statistics, and a light/dark mode toggle for better usability.</p>

<p>This project showcases my skills in full-stack development, including API design, backend development with database integration, frontend development with advanced UI features, and state management, making it a standout addition to my portfolio. Follow the instructions below to run the app locally and explore its features!</p>

![image](https://github.com/user-attachments/assets/010731fe-fee4-4192-837d-6a7838eb95ed)

<h2>Features</h2>

<ul>
    <li><strong>Virtual Dice Rolling</strong>: Roll any standard TTRPG dice (e.g., 1d20, 2d6, 3d8) using a RESTful API built with Go.</li>
    <li><strong>Roll History</strong>: View your roll history, stored server-side in a SQLite database, with details like the dice rolled, individual results, total, and timestamp.</li>
    <li><strong>Detailed Statistics</strong>: Analyze your rolls with a stats page featuring:
        <ul>
            <li>Average and most common roll totals.</li>
            <li>Per-die-type breakdown (e.g., stats for d6, d20).</li>
            <li>Interactive bar chart for roll distribution, filterable by die type.</li>
            <li>Line chart showing roll totals over time.</li>
        </ul>
    </li>
    <li><strong>Light/Dark Mode</strong>: Toggle between light and dark themes for a comfortable viewing experience.</li>
    <li><strong>Responsive Design</strong>: Built with Tailwind CSS for a clean, responsive UI that works on desktop and mobile.</li>
</ul>

![image](https://github.com/user-attachments/assets/dffdabd3-2c66-4d88-bab4-0a3a9134e975)

<h2>Tech Stack</h2>

<ul>
    <li><strong>Frontend</strong>: React, Tailwind CSS, Chart.js</li>
    <li><strong>Backend</strong>: Python Flask, SQLite</li>
    <li><strong>API</strong>: Go (with <code>gorilla/mux</code> for routing)</li>
    <li><strong>Deployment</strong>: Designed for local testing</li>
</ul>

<h2>Prerequisites</h2>

<p>Before setting up the project, ensure you have the following installed on your machine:</p>

<ul>
    <li><strong>Git</strong>: To clone the repository.</li>
    <li><strong>Node.js and npm</strong>: For the React frontend (Node.js 16+ recommended).</li>
    <li><strong>Go</strong>: For the dice-rolling API (Go 1.22+ recommended).</li>
    <li><strong>Python 3</strong>: For the Flask backend (Python 3.9+ recommended).</li>
    <li><strong>pip</strong>: To install Python dependencies.</li>
</ul>

<p>You can check if these are installed by running:</p>

<pre><code>git --version
node --version
npm --version
go version
python3 --version
pip3 --version</code></pre>

<h2>Setup Instructions</h2>

<p>Follow these steps to clone the repository and install the necessary dependencies.</p>

<h3>1. Clone the Repository</h3>

<p>Clone the project to your local machine:</p>

<pre><code>git clone https://github.com/Zemorath/Dice-Roller.git
cd Dice-Roller</code></pre>

<h3>2. Install Dependencies</h3>

<h4>Go API (dice-roller-api)</h4>

<p>The API handles dice rolling and is located in the <code>api/</code> directory.</p>

<pre><code>cd api
go mod tidy</code></pre>

<p>This will install the required Go dependencies, including <code>gorilla/mux</code>.</p>

<h4>Flask Backend (dice-roller-backend)</h4>

<p>The backend manages roll history using SQLite and is located in the <code>backend/</code> directory.</p>

<pre><code>cd ../backend
pip3 install -r requirements.txt</code></pre>

<p>This installs Flask, Flask-Session, and Flask-CORS.</p>

<h4>React Frontend (dice-roller-frontend)</h4>

<p>The frontend is in the <code>frontend/</code> directory and requires Node.js dependencies.</p>

<pre><code>cd ../frontend
npm install</code></pre>

<p>This installs React, Tailwind CSS, Chart.js, React Router, and other dependencies.</p>

<h3>3. Run the Application</h3>

<p>You’ll need to run three components: the Go API, the Flask backend, and the React frontend. Open three separate terminal windows (or tabs) and run the following commands.</p>

<h4>Terminal 1: Run the Go API</h4>

<pre><code>cd Dice-Roller/api
go run main.go</code></pre>

<ul>
    <li>The API will start on <code>http://localhost:8080</code>.</li>
    <li>It handles dice rolling requests (e.g., <code>GET /roll/2d6</code>).</li>
</ul>

<h4>Terminal 2: Run the Flask Backend</h4>

<pre><code>cd Dice-Roller/backend
python3 app.py</code></pre>

<ul>
    <li>The backend will start on <code>http://localhost:5000</code>.</li>
    <li>It manages roll history, storing rolls in a SQLite database (<code>backend/db/rolls.db</code>).</li>
</ul>

<h4>Terminal 3: Run the React Frontend</h4>

<pre><code>cd Dice-Roller/frontend
npm start</code></pre>

<ul>
    <li>The frontend will start on <code>http://localhost:3000</code> and open in your default browser.</li>
</ul>

<h3>4. Test the App</h3>

<ul>
    <li>Open <code>http://localhost:3000</code> in your browser.</li>
    <li>Enter a dice notation (e.g., “2d6”) and click “Roll” to roll dice.</li>
    <li>View your roll history below the roll button (stored in the SQLite database).</li>
    <li>Navigate to the “Stats” page to see detailed statistics, including:
        <ul>
            <li>Average and most common roll totals.</li>
            <li>Per-die-type stats with roll counts, averages, and most common totals.</li>
            <li>A bar chart of roll distributions, filterable by die type (e.g., d6, d20).</li>
            <li>A line chart showing roll totals over time.</li>
        </ul>
    </li>
    <li>Toggle between light and dark modes using the lightbulb icon in the top-right corner.</li>
</ul>

<h2>Notes</h2>

<ul>
    <li><strong>Roll History</strong>: Rolls are stored in a SQLite database (<code>backend/db/rolls.db</code>) on your local machine, persisting across sessions until the database is deleted.</li>
    <li><strong>Local Testing</strong>: This app is designed to run locally. Ensure all three components (Go API, Flask backend, React frontend) are running as described above.</li>
    <li><strong>Future Enhancements</strong>: The app could be extended with features like user authentication, more advanced statistics, or deployment to a hosting platform with persistent storage.</li>
</ul>

<h2>Contributing</h2>

<p>Feel free to fork this repository, make improvements, and submit pull requests. If you encounter any issues or have suggestions, please open an issue on GitHub.</p>

<h2>License</h2>

<p>This project is licensed under the MIT License—see the LICENSE file for details.</p>

<h2>Acknowledgments</h2>

<ul>
    <li>Built as a portfolio project to demonstrate full-stack development skills.</li>
    <li>Thanks to PRIMEAGEN for inspiring me to take on this project during my coding bootcamp.</li>
    <li>Thanks to the open-source community for tools like React, Tailwind CSS, Flask, Go, and Chart.js.</li>
</ul>

<p>---</p>

<p>Happy rolling! 🎲</p>
