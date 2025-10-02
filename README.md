# 🚍 Smart Public Transportation System (Ethiopia)

## 📌 Overview
The **Smart Public Transportation System** is a digital solution to improve Ethiopia's bus transport network by offering:

- Real-time bus tracking
- Route and terminal management
- Passenger engagement and feedback
- Transparent operations for multiple bus companies

The system includes:

- **Mobile App** (Flutter) for passengers
- **Web Admin Dashboard** (React.js) for super admins and company admins
- **Backend API** (Node.js + Express)
- **Database** (PostgreSQL)

---

## 🛠 Problem Statement
Ethiopia’s public transport faces:

- Inefficient scheduling and routes
- Lack of real-time updates for passengers
- Overcrowding without advance notice
- Poor communication between companies and passengers

Our solution offers **tracking, route optimization, bus capacity monitoring, and feedback systems** to enhance efficiency, safety, and satisfaction.

---

## ✨ Features

### Passenger App
1. View available bus terminals  
2. Real-time bus location and route updates  
3. Estimated Time of Arrival (ETA)  
4. Bus capacity display  
5. Driver and vehicle info  
6. Feedback and rating system  
7. Create a hail

### Admin Dashboard

#### Super Admin (Transport Minister)
- Manage and monitor all bus companies  
- Approve or reject company registrations  
- Access system-wide analytics  

#### Admin (Bus Company Manager)
- Add/remove buses  
- Assign drivers  
- Monitor real-time bus operations (Active, InActive) 
- Review passenger feedback  

#### Driver
- Update bus status and capacity  
- Share location data in real time  

---

## 🏗 Tech Stack

| Component       | Technology                  |
|-----------------|-----------------------------|
| Mobile App      | Flutter                     |
| Web App         | React.js                    |
| Backend         | Node.js + Express           |
| Database        | PostgreSQL                  |
| Auth            | JWT Authentication          |
| Maps & Tracking | Gebeta Maps API             |

---

## 📂 Project Structure

smart-transport-system/
├── backend/        # Node.js backend API
│   ├── src/
│   └── package.json
├── frontend/       # React.js frontend for superadmin
│   └── src/
├── mobileapp/      # Flutter or React Native passenger app
│   └── src/
└── README.md


---

## 👥 User Roles
- **Super Admin:** Manages all companies and system analytics  
- **Admin:** Manages buses, drivers, and feedback for their company  
- **Driver:** Updates status, location, and capacity in real time  
- **Passenger:** Tracks buses, views ETA, and gives feedback  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-org/smart-transport-system.git
cd smart-transport-system
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Add your DB credentials & API keys
npm run dev
```

### 3️⃣ Mobile App Setup

**React Native**

```bash
cd mobileapp
npm install
npm start
```

**Flutter**

```bash
cd mobileapp
flutter pub get
flutter run
```

### 4️⃣ Frontend (Superadmin) Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔒 Environment Variables

Create a `.env` file in `/backend` with the following:

```ini
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/transport
JWT_SECRET=your_jwt_secret
MAPS_API_KEY=your_google_maps_api_key
```

---

## 📅 Development Workflow (Group Project)

**Branching Model**

* `main` → Stable branch
* `dev` → Development branch
* `feature/<feature-name>` → Individual feature branches

**Contribution Process**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/add-eta
# Work on your feature
git commit -m "Added ETA calculation"
git push origin feature/add-eta
```

Open a Pull Request → Merge after review.

**Task Management**

* Use GitHub Projects or Issues to assign and track tasks.

---

## 📊 Future Enhancements

* Taxi & ride-sharing integration
* AI demand prediction for routes

