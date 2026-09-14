<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:0F172A,50:1E293B,100:0F172A&text=Health%20Triage%20%26%20Clinical%20Intake%20System&fontColor=FFFFFF&fontSize=36&fontAlignY=40&desc=Next.js%20%20TypeScript%20%20Tailwind%20CSS%20%20Patient%20Care%20Flow&descColor=94A3B8&descFontSize=15&descAlignY=62" width="100%" alt="Health Triage & Clinical Intake System" />

<br />

[![GitHub stars](https://img.shields.io/github/stars/chilkotiKartik/=for-the-badge&logo=github&color=1E293B)](https://github.com/chilkotiKartik/health-triage-portal/stargazers)
[![License](https://img.shields.io/badge/License-MIT-0284c7?style=for-the-badge)](LICENSE)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-10b981?style=for-the-badge)](https://github.com/chilkotiKartik/health-triage-portal)
[![Author](https://img.shields.io/badge/Author-Kartik%20Chilkoti-6366f1?style=for-the-badge)](https://github.com/chilkotiKartik)

</div>

---

## 📌 Project Overview

A digital patient triage portal offering automated symptom intake, priority scoring, clinical department routing, and teleconsultation appointment booking.

---

## 🚀 Key Features

- **Symptom Screening:** Step-by-step patient interview with urgency level scoring.
- **Specialist Booking:** Real-time physician calendar integration and slot booking.
- **Secure Medical Intake:** Encrypted form inputs adhering to healthcare data standards.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js, React, TypeScript |
| **UI Framework** | Tailwind CSS, Radix UI Primitives |
| **Validation** | Zod, React Hook Form |

---

## 📂 Repository Structure

`	ext
health-triage-portal/
??? app/                    # Triage questionnaires, booking & confirmation
??? components/             # Medical iconography, patient cards, calendars
??? lib/                    # Triage algorithms & scoring rubrics
`

---

## ⚙️ Environment Configuration

Create a .env.local or .env file in the root directory:

`nv
NEXT_PUBLIC_CLINIC_ID=clinic_default
DATABASE_URL=postgresql://user:pass@localhost:5432/health_db
`

---

## 🚦 Getting Started

### 1. Clone the Repository
`ash
git clone https://github.com/chilkotiKartik/health-triage-portal.git
cd health-triage-portal
`

### 2. Install Dependencies
`ash
npm install
`

### 3. Run Development Server
`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👤 Author

**Kartik Chilkoti**
- **GitHub:** [@chilkotiKartik](https://github.com/chilkotiKartik)
- **Email:** [chilkotikartik@gmail.com](mailto:chilkotikartik@gmail.com)

---

<div align="center">
<sub>Engineered with precision by <strong>Kartik Chilkoti</strong> &bull; All rights reserved.</sub>
</div>