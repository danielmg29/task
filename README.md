# Task Manager

A full-stack task management application built with Django and Next.js.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ RESTful API with Django REST Framework
- ✅ Modern UI with Next.js and shadcn/ui
- ✅ Real-time updates without page refresh

## Tech Stack

### Backend
- Python 3.13
- Django 5.x
- Django REST Framework
- SQLite database

### Frontend
- Next.js 15 (App Router)
- TypeScript
- shadcn/ui components
- Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
   cd backend
```

2. Create and activate virtual environment:
```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   source venv/bin/activate      # Mac/Linux
```

3. Install dependencies:
```bash
   pip install django djangorestframework django-cors-headers
```

4. Run migrations:
```bash
   python manage.py migrate
```

5. Create superuser (optional):
```bash
   python manage.py createsuperuser
```

6. Start development server:
```bash
   python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Start development server:
```bash
   npm run dev
```

Frontend runs at `http://localhost:3000`

## API Endpoints

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PATCH /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

## Project Structure
```
task-manager/
├── backend/          # Django backend
│   ├── config/       # Project settings
│   ├── core/         # Task app
│   └── manage.py
└── frontend/         # Next.js frontend
    ├── app/          # Pages
    ├── components/   # React components
    └── lib/          # Utilities
```

## Learning Goals

This project demonstrates:
- Full-stack development with separate frontend/backend
- RESTful API design
- React state management
- TypeScript type safety
- Modern UI component libraries
- Git version control

## Author

Built while learning full-stack development with the Adaptive Convergence philosophy.

## License

MIT