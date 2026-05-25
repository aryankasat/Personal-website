# 🌌 Aryan Kasat - Personal Website & Portfolio

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Welcome to the repository of my personal portfolio and website. This project serves as a unified digital portal showcasing my professional experiences, engineering projects, research publications, technical blog posts, and system design case studies. 

The application is built with a high-performance **FastAPI** backend in Python serving static resources and dynamic API endpoints, and a premium **Vanilla HTML5/CSS3/JS** frontend designed with modern, clean, and responsive aesthetics.

---

## 🚀 Key Features

- **Unified Portfolio Dashboard**: Elegant, interactive, and responsive UI displaying professional profile summary, work history, education, skills, and certifications.
- **Dynamic Content & Blog Engine**: Serves research blogs and system design articles using structured JSON metadata. Supports markdown-formatted article contents rendered beautifully on the fly.
- **Asynchronous Contact Form**: Fully integrated contact form validating user inputs client/server-side and asynchronously dispatching contact emails via SMTP.
- **Image Upload System**: Secure, local filesystem storage endpoint (`/upload-image`) for handling media uploads with unique UUIDs.
- **Automated API Documentation**: Auto-generated interactive Swagger UI and Redoc API documentation available out-of-the-box (in debug mode).

---

## 🛠️ Technology Stack

### Backend
- **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (v0.104.1) & [Uvicorn](https://www.uvicorn.org/) (v0.24.0)
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/) (v2.5.0)
- **Email Dispatching**: [aiosmtplib](https://github.com/cole/aiosmtplib) (v3.0.1) & [email-validator](https://github.com/JoshData/python-email-validator) (v2.1.0)
- **Environment Management**: [python-dotenv](https://github.com/theofidry/django-dotenv-sane) (v1.0.0)
- **Asynchronous File Handling**: [aiofiles](https://github.com/Tinche/aiofiles) (v23.2.1) & `python-multipart`

### Frontend
- **Structure**: Semantic HTML5 with an article reader sub-page (`static/article.html`)
- **Styling**: Vanilla CSS3 with custom variables, smooth transitions, card layouts, and responsive flexbox/grid structures
- **Logic**: Vanilla JavaScript utilizing the `Fetch API` for backend updates, dynamic DOM assembly, filter mechanics, and contact form handling

---

## 📁 Directory Structure

```text
├── .env                  # Local configuration settings and credentials
├── LICENSE               # MIT License
├── README.md             # Project documentation (this file)
├── config.py             # App config, environment variables, & JSON helpers
├── main.py               # Main entrypoint; mounts APIs and frontend static assets
├── models.py             # Pydantic schema models for validation
├── requirements.txt      # Python dependencies
├── data/                 # JSON files containing database records
│   ├── blogs.json        # Technical blog articles (markdown supported)
│   ├── profile.json      # Profile, experience, projects, skills, education, certs
│   └── system_designs.json # System architecture articles (markdown supported)
├── routes/               # API routers partitioned by feature
│   ├── contact.py        # /api/contact endpoint (sends contact email)
│   ├── content.py        # /api/blogs & /api/system-designs endpoints
│   ├── experience.py     # /api/experience endpoints
│   ├── general.py        # /api/profile, /api/about, /api/education, /api/certifications
│   ├── projects.py       # /api/projects endpoint (supports tags/tech filtering)
│   ├── publications.py   # /api/publications endpoints
│   └── skills.py         # /api/skills endpoints
├── static/               # Frontend static assets
│   ├── index.html        # Main landing page
│   ├── index.css         # Styling system
│   ├── index.js          # Core frontend JS application logic
│   ├── article.html      # Dynamic article reader layout (used for blogs/designs)
│   └── profile.jpg       # Profile picture asset
├── uploads/              # Local storage folder for uploaded images
└── utils/                # Utility helpers
    ├── email_service.py  # Asynchronous SMTP dispatch logic
    └── validators.py     # Input sanitization and validators
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.8 or higher installed on your local machine.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/aryankasat/Personal-website.git
   cd Personal-website
   ```

2. **Set Up a Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or copy the baseline from below) and fill in your SMTP details if you want the contact form to dispatch emails:
   ```env
   # Portfolio Environment Configuration
   BACKEND_URL=http://localhost:8000
   API_ENDPOINT=/api
   CONTACT_EMAIL=your_email@outlook.com
   CONTACT_EMAIL_PASSWORD=your_email_password_or_app_passcode
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   DEBUG=True
   ```

---

## 🏃 Running the Application

To start the local Uvicorn development server:

```bash
python main.py
```

Once started:
- Access the website at **[http://localhost:8000](http://localhost:8000)**.
- Access the interactive API docs (Swagger UI) at **[http://localhost:8000/docs](http://localhost:8000/docs)** (visible when `DEBUG=True` in `.env`).

---

## ✍️ Customizing Content

All website details are dynamically served from JSON files under the `data/` directory. You can customize the site content without editing any backend/frontend code:

### 1. Modifying Profile, Skills, and Experience
Open [data/profile.json](file:///Users/aryankasat/Documents/Aryan/Codes/Personal-website/data/profile.json) to edit:
- **`profile`**: Name, subtitle title, tagline, location, and social links (LinkedIn, GitHub, etc.).
- **`about`**: Professional summary paragraph and major highlights.
- **`experience`**: Array of job roles, descriptions, dates, and bullet achievements.
- **`projects`**: Custom project entries including title, descriptions, tech stack lists, tags, and source code links.
- **`skills`**: Organized by categories (e.g. `deep_learning_frameworks`, `llm_genai_tools`).
- **`publications`**: Academic papers details including authors, venue, date, and link.
- **`education` & `certifications`**: Academic degrees and online certifications.

### 2. Adding / Editing Articles (Blogs & System Designs)
Blog entries and system design case studies are located in [data/blogs.json](file:///Users/aryankasat/Documents/Aryan/Codes/Personal-website/data/blogs.json) and [data/system_designs.json](file:///Users/aryankasat/Documents/Aryan/Codes/Personal-website/data/system_designs.json) respectively.

Each entry follows this JSON structure:
```json
{
  "id": 1,
  "title": "Article Title",
  "category": "Technology Category",
  "date": "YYYY-MM-DD",
  "readTime": "X min read",
  "summary": "Brief summary displayed on the card selection widget.",
  "content": "# Markdown formatted content...\n\nUse standard Markdown tags (headers, lists, tables, images, codeblocks, math formula) for writing your articles here."
}
```

---

## 🔌 API Endpoints Summary

Below are the primary REST API routes registered under the `/api` prefix:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/profile` | Fetches base profile details (name, title, location, socials) |
| **GET** | `/api/about` | Fetches personal about summaries and milestones |
| **GET** | `/api/experience` | Fetches list of work experiences |
| **GET** | `/api/projects` | Fetches projects (supports filtering via `?category=...` or `?tech=...`) |
| **GET** | `/api/skills` | Fetches technical skill classifications |
| **GET** | `/api/publications` | Fetches publications list |
| **GET** | `/api/blogs` | Lists all blogs |
| **GET** | `/api/blogs/{blog_id}` | Fetches full markdown content for a specific blog |
| **GET** | `/api/system-designs` | Lists all system designs |
| **GET** | `/api/system-designs/{design_id}`| Fetches full markdown content for a specific system design |
| **POST** | `/api/contact` | Submits a contact inquiry form (validates fields and sends SMTP email) |
| **POST** | `/upload-image` | Uploads an image to the local `uploads/` directory |

---

## ⚖️ License

Distributed under the MIT License. See [LICENSE](file:///Users/aryankasat/Documents/Aryan/Codes/Personal-website/LICENSE) for more information.
