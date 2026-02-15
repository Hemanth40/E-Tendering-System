<div align="center">

# 🏛️ E-Tendering System

### Blockchain-Powered Electronic Procurement Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <strong>A full-stack decentralized e-tendering platform</strong> that brings transparency, security, and immutability to the procurement process using blockchain technology.
</p>

---

<p>
  <a href="#-features">Features</a> •
  <a href="#️-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-smart-contract">Smart Contract</a>
</p>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Secure Authentication
- JWT-based authentication system
- Bcrypt password hashing
- Role-based access control (Admin, Bidder, Organizer)

### 📋 Tender Management
- Create, publish, and manage tenders
- Set budgets, deadlines, and requirements
- Full tender lifecycle (Draft → Published → Closed → Evaluated)

### 🔔 Real-time Notifications
- In-app notification system
- Bid status updates
- Tender lifecycle alerts

</td>
<td width="50%">

### ⛓️ Blockchain Integration
- Immutable tender records on Ethereum (Ganache)
- On-chain bid verification & hashing
- Transparent winner selection via smart contract
- Tamper-proof audit trail

### 💰 Smart Bidding
- Submit bids with document attachments
- Blockchain-verified bid integrity
- Automatic lowest-bid winner selection
- Bid rejection capabilities

### 🎨 Modern UI/UX
- Responsive React frontend
- Smooth Framer Motion animations
- TailwindCSS styling
- Intuitive dashboards for each role

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---:|:---:|
| **Frontend** | React 18 + TailwindCSS | Responsive UI with animations |
| **Backend** | FastAPI (Python) | High-performance REST API |
| **Database** | MongoDB | Document-based data storage |
| **Blockchain** | Solidity + Ganache | Smart contract & local blockchain |
| **Web3** | Web3.py + Web3.js | Blockchain interaction layer |
| **Auth** | JWT + Bcrypt | Secure token-based authentication |

</div>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Home    │ │  Admin   │ │  Bidder  │ │  Tender   │  │
│  │  Page    │ │Dashboard │ │Dashboard │ │  Detail   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
│       │             │            │              │        │
│       └─────────────┴────────────┴──────────────┘        │
│                         │ Axios                          │
├─────────────────────────┼────────────────────────────────┤
│                    BACKEND (FastAPI)                      │
│  ┌──────┐ ┌────────┐ ┌──────┐ ┌──────────────┐          │
│  │ Auth │ │Tenders │ │ Bids │ │Notifications │          │
│  │Routes│ │ Routes │ │Routes│ │   Routes     │          │
│  └──┬───┘ └───┬────┘ └──┬───┘ └──────┬───────┘          │
│     │         │         │            │                   │
│     └─────────┴─────────┴────────────┘                   │
│              │                    │                       │
├──────────────┼────────────────────┼───────────────────────┤
│              ▼                    ▼                       │
│  ┌───────────────────┐  ┌─────────────────────┐          │
│  │   MongoDB         │  │  Ganache Blockchain  │          │
│  │  (e_tendering)    │  │  (Smart Contract)    │          │
│  └───────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Software | Version | Download |
|:---|:---:|:---|
| **Python** | 3.8+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 16+ | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | Latest | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Ganache** | Latest | [trufflesuite.com](https://trufflesuite.com/ganache/) |

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/e-tendering-system.git
cd e-tendering-system
```

#### 2️⃣ Start MongoDB & Ganache

```bash
# Ensure MongoDB is running on localhost:27017
# Open Ganache → Create workspace on HTTP://127.0.0.1:7545
```

#### 3️⃣ Deploy Smart Contract

```bash
cd contracts

# Install Solidity compiler
pip install web3 py-solc-x

# Compile & deploy
python compile_and_deploy.py compile
python compile_and_deploy.py deploy
```

#### 4️⃣ Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv myenv
myenv\Scripts\activate          # Windows
# source myenv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

> 🟢 Backend runs at **http://localhost:8000** — API docs at **http://localhost:8000/docs**

#### 5️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
```

> 🟢 Frontend runs at **http://localhost:3000**

---

## 📖 Usage

### 👤 User Roles

<table>
<tr>
<td align="center" width="33%">

### 🛡️ Admin
Create & manage tenders<br>
Evaluate bids<br>
Declare winners<br>
System notifications

</td>
<td align="center" width="33%">

### 💼 Bidder
Browse tenders<br>
Submit bids<br>
Upload documents<br>
Track bid status

</td>
<td align="center" width="33%">

### 📊 Organizer
Create tenders<br>
Manage workflows<br>
Send notifications<br>
Monitor progress

</td>
</tr>
</table>

### 🔄 Workflow

```
1. Register   →  Create account with role & Ganache wallet address
2. Login      →  Authenticate and access role-based dashboard
3. Create     →  Admin/Organizer creates a tender (Draft)
4. Publish    →  Tender goes live for bidders
5. Bid        →  Bidders submit bids (recorded on blockchain)
6. Close      →  Admin closes tender to new bids
7. Evaluate   →  Smart contract selects lowest bid as winner
8. Notify     →  Winner & participants receive notifications
```

---

## 📡 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login & get JWT token |
| `GET` | `/auth/me` | Get current user info |

</details>

<details>
<summary><strong>📋 Tenders</strong></summary>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/tenders/` | Create tender |
| `GET` | `/tenders/` | List all tenders |
| `GET` | `/tenders/{id}` | Get tender details |
| `PUT` | `/tenders/{id}/publish` | Publish tender |
| `PUT` | `/tenders/{id}/close` | Close tender |
| `PUT` | `/tenders/{id}/evaluate` | Evaluate & pick winner |

</details>

<details>
<summary><strong>💰 Bids</strong></summary>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/bids/{tender_id}` | Submit bid |
| `GET` | `/bids/tender/{tender_id}` | Get bids for tender |
| `GET` | `/bids/my-bids` | Get my bids |
| `GET` | `/bids/all` | Get all bids (admin) |
| `PUT` | `/bids/{bid_id}/reject` | Reject bid |

</details>

<details>
<summary><strong>🔔 Notifications</strong></summary>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/notifications/` | Get all notifications |
| `GET` | `/notifications/unread` | Get unread |
| `PUT` | `/notifications/{id}/read` | Mark as read |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `DELETE` | `/notifications/{id}` | Delete notification |
| `GET` | `/notifications/count` | Get counts |

</details>

---

## ⛓ Smart Contract

The `TenderContract.sol` manages the core tendering logic on the Ethereum blockchain:

| Function | Access | Description |
|:---|:---:|:---|
| `createTender()` | Admin | Record tender with title, budget, deadline & hash |
| `submitBid()` | Public | Submit bid with amount & integrity hash |
| `closeTender()` | Admin | Close tender to new bids |
| `evaluateBids()` | Admin | Auto-select lowest bid as winner |
| `getTenderBids()` | Public | Retrieve all bids for a tender |
| `getWinningBid()` | Public | Get the declared winner |

> **Winner Selection**: The smart contract automatically picks the **lowest bid** — standard for procurement tenders.

---

## 📁 Project Structure

```
E-Tendering-System/
├── 📂 backend/
│   ├── main.py                 # FastAPI entry point
│   ├── database.py             # MongoDB connection
│   ├── models.py               # Pydantic data models
│   ├── blockchain.py           # Web3/Ganache integration
│   ├── auth.py                 # JWT authentication
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── 📂 routes/
│       ├── auth.py             # Auth endpoints
│       ├── tenders.py          # Tender endpoints
│       ├── bids.py             # Bid endpoints
│       └── notifications.py    # Notification endpoints
├── 📂 frontend/
│   ├── package.json            # Node dependencies
│   └── 📂 src/
│       ├── App.jsx             # Main app with routing
│       ├── 📂 components/
│       │   ├── Navbar.jsx      # Navigation bar
│       │   └── Toast.jsx       # Toast notifications
│       └── 📂 pages/
│           ├── Home.jsx        # Landing page
│           ├── Login.jsx       # Login page
│           ├── Register.jsx    # Registration page
│           ├── AdminDashboard.jsx
│           ├── BidderDashboard.jsx
│           ├── CreateTender.jsx
│           ├── TenderList.jsx
│           ├── TenderDetail.jsx
│           ├── SubmitBid.jsx
│           ├── Profile.jsx
│           └── About.jsx
└── 📂 contracts/
    ├── TenderContract.sol      # Solidity smart contract
    ├── compile_and_deploy.py   # Deployment script
    ├── compiled_contract.json  # Compiled ABI & bytecode
    └── deployment_info.json    # Deployed contract info
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017
GANACHE_URI=http://127.0.0.1:7545
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

> ⚠️ **Important**: Change `JWT_SECRET_KEY` to a strong, random value before any production deployment.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using FastAPI, React, MongoDB & Solidity

</div>
