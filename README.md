# 🎨 Matty – Online Graphic Design Tool

Matty is a **MERN Full Stack Graphic Design Web Application** that allows users to create, edit, and export professional-quality designs directly from the browser. It’s built as a one-stop platform for **posters, banners, social media graphics, and marketing creatives** with drag-and-drop editing capabilities.

---

## 🚀 Features

✅ **User Authentication** – JWT-based login/signup (Google OAuth optional)  
✅ **Canvas Editor** – Drag-drop elements, shapes, text, and images  
✅ **Text Styling** – Fonts, sizes, colors, alignment, rotation  
✅ **Image Upload** – Upload images to canvas (via Cloudinary/AWS S3)  
✅ **Undo/Redo** – Step back/forward in design actions  
✅ **Save Designs** – Store user designs in MongoDB with preview thumbnails  
✅ **My Designs Dashboard** – Access saved projects anytime  
✅ **Export Options** – Download designs as PNG/PDF  
✅ **Role Management** – Admin & Registered User roles  
✅ **Secure Data Handling** – JWT auth, input validation, CORS  

---

## 🛠️ Tech Stack

**Frontend:** React.js, Redux, TailwindCSS, react-konva / fabric.js  
**Backend:** Node.js, Express.js, Mongoose  
**Database:** MongoDB Atlas  
**Authentication:** JWT / OAuth (Google)  
**File Storage:** Cloudinary / AWS S3  
**Deployment:** Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas  

---

## 📂 Project Structure

```
matty-ai-design-tool/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI Components (Navbar, Editor, Dashboard)
│   │   ├── pages/        # Auth, Dashboard, Editor pages
│   │   ├── redux/        # State management
│   │   ├── utils/        # Helpers
│   │   └── App.jsx
│   └── package.json
│
├── server/               # Node/Express backend
│   ├── models/           # Mongoose Schemas (User, Design)
│   ├── routes/           # Auth & Design APIs
│   ├── controllers/      # Business logic
│   ├── middleware/       # JWT validation
│   ├── server.js         # App entry
│   └── package.json
│
├── uploads/              # Local uploads (optional if using Cloudinary)
├── .env.example          # Environment variables
├── README.md             # Project documentation
└── package.json          # Root config
```

---

## 🗄️ Database Schema

### **User Model**
```json
{
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "date"
}
```

### **Design Model**
```json
{
  "userId": "ObjectId",
  "title": "string",
  "jsonData": "object",    // Konva/Fabric.js data
  "thumbnailUrl": "string",
  "createdAt": "date"
}
```

---

## 🔗 API Endpoints

| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| POST   | `/api/auth/register` | Register a new user         |
| POST   | `/api/auth/login`    | Login user, return JWT      |
| GET    | `/api/designs`       | Fetch user's saved designs  |
| POST   | `/api/designs`       | Save a new design           |
| PUT    | `/api/designs/:id`   | Update existing design      |
| DELETE | `/api/designs/:id`   | Delete a design             |

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/matty-ai-design-tool.git
cd matty-ai-design-tool
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
cp .env.example .env   # configure MongoDB URI, JWT_SECRET, Cloudinary keys
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../client
npm install
npm start
```

### 4️⃣ Environment Variables  
`.env` file (backend):  
```
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## 🧪 Testing

- **Unit Testing** – Jest for backend logic  
- **Integration Testing** – Supertest for API endpoints  
- **Manual UI Testing** – Postman & Browser  

Run tests:
```bash
npm test
```

---

## 🌐 Deployment

- **Frontend**: Vercel / Netlify  
- **Backend**: Render / Railway  
- **Database**: MongoDB Atlas  
- **Storage**: Cloudinary  

---

## 📅 Roadmap

- [x] Basic Editor with text/images/shapes  
- [x] Save/Load designs  
- [x] Export as PNG/PDF  
- [ ] Templates gallery  
- [ ] Real-time collaboration (Socket.io)  
- [ ] Premium template store  
- [ ] Mobile app version  

---

## 🔒 Security

- JWT authentication  
- CORS handling  
- Secure file upload via Cloudinary  
- Input sanitization & validation  

---

