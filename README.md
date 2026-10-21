# Smart Rainwater Harvesting System

A MERN stack web application designed to manage rainwater harvesting systems, storage structures, inspections, and maintenance activities through a centralized dashboard.

## Features

- **Dashboard** – Overview of rainwater management activities.
- **Harvesting Systems** – Add, view, update, and delete harvesting system records.
- **Storage Structures** – Manage storage capacity, water levels, and structure conditions.
- **Inspections** – Manage inspection records.
- **Maintenance** – Track maintenance activities.
- **User Management** – Manage application users with role-based access.
- **Authentication** – Secure login and protected API routes.

## Technologies Used

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Token-based authentication
- **Version Control:** Git and GitHub

## Project Structure

```text
SmartRainwaterHarvesting/
├── client/
│   └── src/
│       ├── components/
│       └── pages/
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/nivedha0704/SmartRainwaterHarvesting.git
cd SmartRainwaterHarvesting
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder and configure the environment variables required by the application. Never commit this file or publish your database credentials or secret keys.

### 3. Start the backend

```bash
node server.js
```

### 4. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Security

- Keep database credentials and authentication secrets private.
- Do not upload `.env` files.
- Use authorized accounts to access protected features.

## Future Enhancements

- Rainfall monitoring and water collection analytics.
- Notifications for critical storage conditions.
- Advanced reports and data visualization.

## Author

**Nivedha S.**

GitHub: [@nivedha0704](https://github.com/nivedha0704)
