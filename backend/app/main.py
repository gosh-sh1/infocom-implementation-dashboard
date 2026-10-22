from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from typing import Optional

from . import models, database
from .database import engine, get_db

# Создаем таблицы при запуске (если их нет)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="InfoCom Dashboard API")

# --- Схемы Pydantic для валидации входящих данных ---
class ProjectCreate(BaseModel):
    title: str

class TaskCreate(BaseModel):
    title: str
    status: str = "To Do"
    project_id: int
    deadline: Optional[date] = None

# --- Эндпоинты для Проектов ---
@app.post("/api/projects")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = models.Project(title=project.title)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

# --- Эндпоинты для Задач (с бизнес-логикой) ---
@app.post("/api/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # 1. Создаем задачу
    new_task = models.Task(
        title=task.title, 
        status=task.status, 
        project_id=task.project_id,
        deadline=task.deadline
    )
    db.add(new_task)
    
    # 2. БИЗНЕС-ЛОГИКА: Если задача "Blocker" — меняем статус проекта!
    if task.status == "Blocker":
        project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
        if project:
            project.status = "Blocked"
            
    db.commit()
    db.refresh(new_task)
    return {"message": "Задача создана", "task_id": new_task.id}

@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()