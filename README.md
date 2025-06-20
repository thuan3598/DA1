# 💻 Guide to Running the Online Medical Appointment Booking Project

The project consists of two main components:

* **Frontend**: Built with ReactJS [1].
* **Backend**: Built with Node.js, Express, and Sequelize [2][3].

## 📦 Prerequisites

* Node.js >= 14.x
* npm >= 6.x
* MySQL (if the backend connects to a database)
* Git (for cloning the repository if needed)

---

## 📁 Project Structure

```
/project-root
│
├── frontend/        # ReactJS client
└── backend/         # NodeJS API server
```

---

## 🔧 Environment Configuration

Create a `.env` file for **each component** based on the provided `.env.example` files (if available):

### 📁 backend/.env

```env
PORT=8080
NODE_ENV=development
URL_REACT=http://localhost:3000
MAX_NUMBER_SCHEDULE=your_max_schedule
EMAIL_APP_PASSWORD=your_email_app_password
EMAIL_APP=your_email_app
```

### 📁 frontend/.env

```env
PORT=3000
NODE_ENV=development
REACT_APP_BACKEND_URL=http://localhost:8080
# The base URL for all locations. If your app is served from a sub-directory on your server, you'll want to set
# this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
REACT_APP_ROUTER_BASE_NAME=/your-subdirectory
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

---

## ▶️ Setting Up and Running the Backend

```bash
cd backend
npm install             # Install required packages
npx sequelize-cli db:migrate   # Run migrations (if applicable)
npm start               # Start the server (development mode)
```

> The server will run by default at `http://localhost:8080`.

---

## ▶️ Setting Up and Running the Frontend

```bash
cd frontend
npm install         # Install React dependencies
npm start           # Start the React application
```

> The frontend web application will run at `http://localhost:3000`.

---

## 📊 Testing

* Access `http://localhost:3000` to open the web interface.
* Verify the API connection between the frontend and backend (e.g., through login, booking appointments, etc.).

---

## 📝 Notes

* Ensure MySQL is running before starting the backend.
* If you `git clone` an existing project, create new `.env` files and reinstall packages using `npm install`.

