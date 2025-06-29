# 📝 DevShade Blog Platform

A full-stack blog application built with **Node.js**, **Express.js**, **MongoDB**, and **EJS** templating. It allows users to read blog posts publicly, while registered users (especially admins) can create, edit, and delete posts.

---

## 📁 Features

- 🔐 JWT-based authentication
- 🧑 Admin dashboard to manage posts
- 📝 Create, edit, and delete blog posts
- ❤️ Like/unlike blog posts (only when logged in)
- 👥 Role-based access (admin vs guest)
- 🔎 Search functionality
- 🌐 Responsive UI using Tailwind CSS
- 🍪 Cookie handling for secure sessions

---

## 🛠 Tech Stack

| Layer     | Tech              |
|-----------|-------------------|
| Backend   | Node.js, Express  |
| Frontend  | EJS, Tailwind CSS |
| Database  | MongoDB + Mongoose|
| Auth      | JWT, Bcrypt       |
| Utilities | Cookie-Parser, Dotenv, Express Layouts |

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/devshade-blog.git
cd devshade-blog
npm install
