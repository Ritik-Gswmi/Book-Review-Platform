# 📚 Book Review Platform (MERN)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4DB33D?style=for-the-badge&logo=mongodb&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A **full-stack Book Review Platform** built with the **MERN stack** that allows users to sign up, log in, add books, review them, and explore reviews from others.

---

## 🚀 Features
- 🔐 User Authentication (JWT + bcrypt)
- 📖 Add / Edit / Delete Books (CRUD)
- ⭐ Add / Edit / Delete Reviews with ratings
- 📊 Average Rating calculation per book
- 📑 Pagination (5 books per page)
- 🔒 Protected routes (only logged-in users can post/edit)
- 🌍 MongoDB Atlas integration

---

## 📂 Project Structure
```
BookReviewPlatform/
├── backend/        # Node.js + Express + MongoDB API
├── frontend/       # React + Tailwind CSS frontend
├── .gitignore      # Git ignored files
├── LICENSE         # MIT License
├── README.md       # Project documentation
└── BookReviewPlatform.postman_collection.json  # API collection for Postman
```

---

## 🖼️ Screenshots (placeholders)

<img src="frontend/src/assets/Screenshot 2025-10-05 194503.png" >
<img src="frontend/src/assets/Screenshot 2025-10-05 195745.png" >
<img src="frontend/src/assets/Screenshot 2025-10-05 194104.png" >
<img src="frontend/src/assets/Screenshot 2025-10-05 194442.png" >


---

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone <https://github.com/Ritik-Gswmi/Book-Review-Platform.git>
cd Book-Review-Platform
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**  
Backend runs on **http://localhost:5000**

---

---

## 📌 API Testing with Postman
Import the included collection:
```
BookReviewPlatform.postman_collection.json
```

It includes:
- Signup
- Login
- Get Books (with pagination)
- Add Book (requires token)
- Add Review (requires token)

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to fork and submit PRs.

---

⭐ If you like this project, consider giving it a star on GitHub!
