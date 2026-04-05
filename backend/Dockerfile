# 1. Base Image: Use the official, lightweight Python 3.10 image
FROM python:3.10-slim

# 2. Environment Variables: Make Python run optimally in a container
# Prevents Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1 
# Ensures logs are pushed immediately to your terminal/server logs
ENV PYTHONUNBUFFERED=1

# 3. Work Directory: Where our code will live inside the container
WORKDIR /backend

# 4. Cache Layer: Copy ONLY requirements first
# (This is a pro-move. Docker will cache this layer so if you change your code 
# but not your packages, rebuilds take 2 seconds instead of 2 minutes).
COPY requirements.txt .

# 5. Install Dependencies: Cleanly and without caching unnecessary files
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy Code: Bring the rest of your app into the container
COPY . .

# 7. Expose Port: Open port 8000 for the outside world to talk to FastAPI
EXPOSE 8000

# 8. Execution Command: Start Uvicorn bound to 0.0.0.0 (required for Docker networking)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]