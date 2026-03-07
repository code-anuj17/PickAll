# 🚚 Vehicle Transport Booking Website

A modern **vehicle transport booking platform** built with **React + TailwindCSS**.
Users can request transport quotes, track shipments, and register/login to the platform.

This project is inspired by logistics platforms like **MyTransport** and demonstrates building a full responsive web interface using modern frontend technologies.

---

# 🌐 Features

* 🚗 Vehicle transport quote request form
* 📦 Shipment tracking interface
* 🔐 Login & Register pages
* 📧 Quote form sends email using EmailJS
* 📱 Fully responsive design
* ⚡ Built using modern React architecture
* 🧩 Reusable components for scalability

---

# 🛠️ Tech Stack

Frontend

* React (Vite)
* TailwindCSS
* React Router
* EmailJS

Development Tools

* Node.js
* Git & GitHub
* VS Code

---

# 📂 Project Structure

```
src
│
├── components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Services.jsx
│   ├── ServiceCard.jsx
│   ├── HowItWorks.jsx
│   ├── QuoteForm.jsx
│   └── Footer.jsx
│
├── pages
│   ├── Home.jsx
│   ├── ServicesPage.jsx
│   ├── QuotePage.jsx
│   ├── TrackPage.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# ⚙️ Installation

Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/transport-booking-website.git
```

Navigate into the project:

```
cd transport-booking-website
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```
VITE_EMAIL_SERVICE=your_service_id
VITE_EMAIL_TEMPLATE=your_template_id
VITE_EMAIL_KEY=your_public_key
```

These are used for sending quote requests via **EmailJS**.

---

# 📸 Screenshots

(Add screenshots of your UI here)

Example sections:

* Homepage
* Quote Form
* Login Page
* Services Section

---

# 🚀 Future Improvements

* OTP authentication using Firebase
* User dashboard
* Admin panel for quote management
* Shipment tracking with map integration
* Payment gateway integration
* Backend API for bookings

---
