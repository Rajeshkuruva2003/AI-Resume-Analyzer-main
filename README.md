# 🧠 AI Resume Analyzer

An interactive web-based application that uses simulated AI to analyze resumes and provide personalized recommendations for improving job readiness.  
The app includes authentication (sign up / sign in) and a user dashboard that suggests skills, certifications, projects, and jobs based on the analyzed resume.

---

## 🚀 Features

### 🔐 Authentication
- User **Sign Up** and **Sign In** with form validation.
- Password strength indicator.
- Stores session data in `localStorage`.
- Simple client-side login redirection between `index.html` and dashboard.

### 📄 Resume Analysis
- Upload a **PDF**, **DOC**, **DOCX**, or **TXT** resume.
- Simulated AI engine assigns a score (Content, Formatting, Keywords).
- Displays **strengths**, **improvements**, and **missing keywords**.
- Personalized feedback and improvement suggestions.

### 💡 Recommendations
- Recommended **certification courses** with links.
- Suggested **projects** based on resume skill gaps.
- Filterable **job listings** with save/apply options.
- Location-based job filter.

### 🧭 Dashboard
- Displays overall resume score.
- Interactive tabs for Certifications, Projects, and Jobs.
- Dynamic content generation using JavaScript.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|--------|-------------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla JS) |
| Styling | Custom CSS + Font Awesome Icons |
| Backend (Simulated) | Browser `localStorage` for authentication and state |
| File Handling | JavaScript File API |
| Data Source | Static JSON-like objects (simulating AI results) |

---

## 📁 Project Structure

├── index.html # Login / Signup page
├── dashboard.html # (Referenced in dashboard.js) - User dashboard
├── dashboard.js # Resume analyzer + recommendation logic
├── script.js # Authentication logic + basic resume scoring
├── style.css # Main stylesheet (not uploaded but required)
└── README.md # Project documentation

---

## ⚙️ How to Run

1. **Clone or Download** this repository.
2. Ensure all files (`index.html`, `dashboard.js`, `script.js`, `style.css`) are in the same folder.
3. Open `index.html` in your browser.
4. **Sign Up** or **Sign In** to access the dashboard.
5. Upload your resume and click **Analyze** to see the simulated AI results.

---

## 🧩 Future Improvements
- Integrate real AI/ML backend using Python (Flask or FastAPI).
- Implement OCR & NLP for true resume parsing.
- Add secure authentication with JWT & database storage.
- Generate automatic improvement suggestions using OpenAI or Hugging Face models.

---

## 📸 Screenshots (Optional)
You can add screenshots of:
- Login page
- Dashboard with resume analysis results
- Recommendations section

---

## 👨‍💻 Author
**Rajesh Kuruva**  
AI & ML Enthusiast | Web Developer  
📧 Email: *[your email here]*  
🌐 GitHub: *[your GitHub profile link]*  

---

## 📜 License
This project is open-source and available under the **MIT License**.

