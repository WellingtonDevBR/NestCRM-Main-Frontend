## 🧾 Introduction

NestCRM is an AI-powered Customer Relationship Management (CRM) platform tailored for businesses that want to understand and retain their customers better. By leveraging artificial intelligence and machine learning, NestCRM predicts customer behavior, detects churn risks, and empowers sales and support teams with intelligent, data-driven insights.

This repository contains the **frontend code** for the NestCRM Dashboard — a modern, responsive, and customizable interface used by end-users to interact with their CRM data. It is built as a **single-tenant application**, where each client gets their own isolated environment, database, and backend infrastructure.

Each tenant accesses the application through their own subdomain: https://{tenant}.nestcrm.com.au/dashboard

---

## ✨ Key Features

- 🔮 **AI-Driven Customer Prediction** – Anticipate customer behavior and identify churn risks in real-time.
- 📊 **Custom Dashboards** – Visualize client activity, leads, and predictive insights.
- 📁 **Contact & Task Management** – Centralized workspace for managing customer relationships.
- 📈 **Reporting & Analytics** – Actionable insights into customer behavior and business performance.
- 🔒 **Per-Tenant Isolation** – Individual databases and servers per customer ensure security and scalability.

---

## 🧱 Tech Stack

**Frontend:**

- React (TypeScript)
- Vite
- Tailwind CSS
- Shadcn UI

**Backend Infrastructure (Per-Tenant):**

- AWS S3 (Static Asset Hosting)
- AWS CloudFront (CDN & Caching)
- AWS EC2 (Server Hosting)
- AWS DynamoDB (Per-Tenant Database)
- AWS Load Balancers (Scalability & Redundancy)
- AI Services for Prediction Models (Custom ML Pipelines)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended via [nvm](https://github.com/nvm-sh/nvm))
- npm

### Local Setup

```bash
# 1. Clone the repo
git clone git@github.com:WellingtonDevBR/NestCRM-Dashboard-Frontend.git

# 2. Navigate into the project
cd NestCRM-Dashboard-Frontend

# 3. Install dependencies
npm install

# 4. Start the local dev server
npm run dev
```
