TTRPG Dice Roller

Welcome to the TTRPG Dice Roller, a full-stack web application designed for tabletop RPG players to roll virtual dice and analyze their roll history. Whether you're rolling a d20 for a critical hit or 2d6 for a skill check, this app provides a seamless experience with a user-friendly interface, detailed statistics, and a light/dark mode toggle for better usability.

This project showcases my skills in full-stack development, including API design, frontend development, and state management, making it a great addition to my portfolio. Follow the instructions below to run the app locally and explore its features!

Features





Virtual Dice Rolling: Roll any standard TTRPG dice (e.g., 1d20, 2d6, 3d8) using a RESTful API built with Go.



Roll History: View your roll history, stored in the browser using localStorage, with details like the dice rolled, individual results, total, and timestamp.



Detailed Statistics: Analyze your rolls with a stats page featuring:





Average and most common roll totals.



Per-die-type breakdown (e.g., stats for d6, d20).



Interactive bar chart for roll distribution, filterable by die type.



Line chart showing roll totals over time.



Light/Dark Mode: Toggle between light and dark themes for a comfortable viewing experience.



Responsive Design: Built with Tailwind CSS for a clean, responsive UI that works on desktop and mobile.

Tech Stack





Frontend: React, Tailwind CSS, Chart.js



API: Go (with gorilla/mux for routing)



Deployment: Designed for local testing (originally deployed on Render’s free tier, now local-only)

Prerequisites

Before setting up the project, ensure you have the following installed on your machine:





Git: To clone the repository.



Node.js and npm: For the React frontend (Node.js 16+ recommended).



Go: For the dice-rolling API (Go 1.22+ recommended).



Python 3: For the Flask backend (Python 3.9+ recommended).



pip: To install Python dependencies.

You can check if these are installed by running:

git --version
node --version
npm --version
go version
python3 --version
pip3 --version

Setup Instructions

Follow these steps to clone the repository and install the necessary dependencies.

1. Clone the Repository

Clone the project to your local machine:

git clone https://github.com/Zemorath/Dice-Roller.git
cd Dice-Roller

2. Install Dependencies

Go API (dice-roller-api)

The API handles dice rolling and is located in the api/ directory.

cd api
go mod tidy

This will install the required Go dependencies, including gorilla/mux.

Flask Backend (dice-roller-backend)

The backend (though currently unused for roll history) is in the backend/ directory.

cd ../backend
pip3 install -r requirements.txt

This installs Flask, Flask-CORS, and gunicorn.

React Frontend (dice-roller-frontend)

The frontend is in the frontend/ directory and requires Node.js dependencies.

cd ../frontend
npm install

This installs React, Tailwind CSS, Chart.js, React Router, and other dependencies.

3. Run the Application

You’ll need to run three components: the Go API, the Flask backend, and the React frontend. Open three separate terminal windows (or tabs) and run the following commands.

Terminal 1: Run the Go API

cd Dice-Roller/api
go run main.go





The API will start on http://localhost:8080.



It handles dice rolling requests (e.g., GET /roll/2d6).

Terminal 2: Run the Flask Backend

cd Dice-Roller/backend
python3 app.py





The backend will start on http://localhost:5000.



Note: The backend is currently unused since roll history is stored client-side, but it’s included for potential future enhancements.

Terminal 3: Run the React Frontend

cd Dice-Roller/frontend
npm start





The frontend will start on http://localhost:3000 and open in your default browser.

4. Test the App





Open http://localhost:3000 in your browser.



Enter a dice notation (e.g., “2d6”) and click “Roll” to roll dice.



View your roll history below the roll button (stored in your browser’s localStorage).



Navigate to the “Stats” page to see detailed statistics and charts of your rolls.



Toggle between light and dark modes using the lightbulb icon in the top-right corner.

Notes





Roll History: Rolls are stored in your browser using localStorage, so they persist across page refreshes but are not synced across devices or browsers. Clearing browser data will reset the history.



Local Testing: This app is designed to run locally. Ensure all three components (Go API, Flask backend, React frontend) are running as described above.



Future Enhancements: To enable server-side roll persistence, the app could be extended with a database like SQLite or PostgreSQL, requiring a hosting platform with persistent storage support.

Contributing

Feel free to fork this repository, make improvements, and submit pull requests. If you encounter any issues or have suggestions, please open an issue on GitHub.

License

This project is licensed under the MIT License—see the LICENSE file for details.

Acknowledgments





Built as a portfolio project to demonstrate full-stack development skills.



Thanks to the open-source community for tools like React, Tailwind CSS, and Chart.js.



Happy rolling! 🎲