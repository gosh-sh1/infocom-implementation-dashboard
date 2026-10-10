from fastapi import FastAPI

app = FastAPI(title="Infocom Implementation Dashboard API")


@app.get("/health")
def health_check():
    """Эндпоинт для проверки работоспособности сервиса."""
    return {"status": "ok"}


@app.get("/")
def root():
    """Корневой эндпоинт."""
    return {"message": "Backend is running"}