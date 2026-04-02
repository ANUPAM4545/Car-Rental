# 🚗 DriveFlow - Premium Car Rental System

A full-stack, comprehensive car rental platform tailored for both individual customers and rental agencies. Built with a React (Vite) frontend and a Node.js/Express backend.

## ✨ Features

- **Role-Based Access Control**: Separate, secure dashboards for "Customers" and "Agencies".
- **Agency Fleet Management**: Agencies can add vehicles to the platform, set daily pricing, and manage their fleet.
- **Booking Workflows**: Customers can browse vehicles, select rental duration, and submit booking requests.
- **Request Approvals**: Agencies review incoming booking requests and can either "Approve" or "Reject" them.
- **Clean Architecture**: A fast React SPA frontend served through a robust Express API backend.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, React Router DOM, Vanilla CSS (Beginner/Hand-written theme).
- **Backend**: Node.js, Express.js, Express-Session.
- **Database**: MySQL (Hosted on Aiven / PlanetScale).
- **Deployment Ready**: Configured for Render (Backend/Full-Stack) and Vercel Serverless.

---

## 🚀 Getting Started Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites
- [Node.js](https://nodejs.org/en) (v18 or higher recommended)
- A MySQL Database (Local or Cloud like Aiven)

### 2. Installation Setup

First, clone the repository and install the backend dependencies:

```bash
git clone https://github.com/ANUPAM4545/Car-Rental.git
cd Car-Rental
npm install
```

Next, install the frontend dependencies:

```bash
cd client
npm install
cd ..
```

### 3. Database Configuration

The application requires a MySQL database connection. You must provide a **Service URI** via an environment variable.

Create a `.env` file in the root directory (or simply export the variable in your terminal) and add your connection string:

```text
DATABASE_URL=mysql://USERNAME:PASSWORD@YOUR-HOST-URL:PORT/defaultdb?ssl-mode=REQUIRED
```

*(If you connected via Aiven, use the exact "Service URI" provided in the Aiven Console).*

### 4. Running the Project (Production Mode)

Because the React frontend is pre-configured to be served by the Express backend, running the project is incredibly simple. 

You need to build the React interface **once**, and then run the server:

```bash
# 1. Build the React Frontend
cd client
npm run build
cd ..

# 2. Start the Express Server
npm start
```

The server will boot up and the application will be accessible globally at:
👉 **[http://localhost:3000](http://localhost:3000)**

*(Note: Every time you make changes to the React code inside the `client/src` folder, you must re-run `npm run build` inside the `client` folder to see the changes applied on the port 3000 server).*

### 5. Running the Project (Development Mode)

If you are actively editing the frontend and want **Hot-Reloading**:

Open **Terminal 1** (Backend):
```bash
node server.js
```
*(Runs on port 3000)*

Open **Terminal 2** (Frontend):
```bash
cd client
npm run dev
```
*(Runs on port 5173. Note: The frontend is configured to automatically proxy API requests back to port 3000).*

---

## 📦 Deployment Instructions

### Vercel Deployment
1. Go to your Vercel Dashboard and click "Import Project".
2. Select your `Car-Rental` repository from GitHub.
3. In the Vercel setup, open **Environment Variables**.
4. Add `DATABASE_URL` as the Key, and your database connection string as the Value.
5. Click **Deploy**. Vercel will automatically read the `vercel.json` and deploy your app.

### Render Deployment
This project is also 100% compatible with Render Web Services. Simply point Render to your repository, set the Build command to `npm install --prefix client && npm run build --prefix client && npm install`, set the Start command to `npm start`, and add your `DATABASE_URL` environment variable.
