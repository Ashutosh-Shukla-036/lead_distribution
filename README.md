# MERN Agents Lead Distribution System

This project is a **MERN stack application** designed to handle lead management.  
It allows an admin to upload CSV/Excel files containing lead data, which is then **validated, normalized, and distributed equally among agents** in the database.  

---

## Features
- **File Upload** – Supports `.csv`, `.xls`, `.xlsx` file formats  
- **Validation** – Ensures correct format and required fields (`FirstName`, `Phone`)  
- **Lead Distribution** – Distributes leads equally among available agents (round-robin allocation, up to 5 agents)  
- **Database Integration** – Leads and assignments stored in MongoDB  
- **Authentication** – Protected routes using JWT middleware  
- **Frontend UI** – Built with Next.js, TailwindCSS, Recoil, and Framer Motion for a smooth experience  

---

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS, Recoil, Framer Motion  
- **Backend:** Node.js, Express.js (via Next.js API routes)  
- **Database:** MongoDB with Mongoose  
- **File Parsing:** csv-parser, xlsx  
- **Authentication:** JWT  

---

## Installation

1. Clone the repository  
```bash
git clone https://github.com/Ashutosh-Shukla-036/lead_distribution.git
cd lead_distribution

Open two terminal
1) cd Backend
2) cd Frontend
```

2. Install dependencies in Frontend and backend
```bash 
npm install
```
3. Configure environment variables (.env) in backend
```bash
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Admin Setup
The system requires at least one Admin user to manage agents and upload leads.
```bash
Create a script file:

// scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path if needed
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "admin@company.local",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin user created successfully");
  process.exit();
};

run().catch((err) => console.error(err));
```
5. Run the script:
```bash
node scripts/createAdmin.js
```
- Default credentials:

```Email: admin@company.local```

```Password: Admin@123```

```(You can log in with these and start uploading leads immediately.)```

6. Start the Backend server
```bash
npm start
The server will run at http://localhost:5000
```

7. Start the Frontend 
```bash
npm run dev
The app will run at http://localhost:3000
```
- Admin login
- Create agents
- File Upload Flow
Admin logs in Uploads a CSV/XLS/XLSX file with lead details
- Backend parses the file → validates format → normalizes rows System fetches available agents from the database (max 5)
- Leads are distributed equally (round-robin) among agents
- Leads are stored in MongoDB with a reference to the assigned agent

 
## Sample CSV Format

```FirstName,Phone,Notes
Alice,9876543210,Interested in product demo
Bob,9123456789,Requested callback next week
Charlie,9988776655,Looking for bulk purchase
```
----
## API Endpoints
```POST /api/auth/login → Authenticate user and return token```

```POSt api/agents/add  → Adds new agents```

```POST /api/upload/file → Upload leads file, validate & distribute```

```GET api/agents/get  → fetchs agents```

```GET /api/upload/distributed → Get distributed leads grouped by agent```

---

## Project Structure
```bash 
lead_distribution/
├── Backend
├── Frontend
```
```
backend/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── seedAdmin.js
├── server.js
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Admin.js
│   ├── Agent.js
│   ├── Lead.js
│   └── User.js
├── routes/
│   ├── agents.js
│   ├── auth.js
│   └── upload.js
└── node_modules/
```

```
frontend/
├── .env
├── .gitignore
├── .next/
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── app/
│   ├── dashboard/
│   │   └── page.js
│   ├── login/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── providers.js
├── components/
│   ├── AddAgentForm.js
│   ├── AgentCard.js
│   ├── Alert.js
│   ├── FileUpload.js
│   ├── LeadTable.js
│   └── Navbar.js
├── hooks/
│   └── useAuthPersist.js
├── lib/
│   ├── api.js
│   └── auth.js
├── node_modules/
└── state/
    ├── alertAtom.js
    └── authAtom.js
```
