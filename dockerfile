# Use the official Python image from Docker Hub
FROM python:3.9-slim

# Set recommended labels
LABEL Name="python-microservice" \
      Version="1.0" \
      Description="Microservice in Python running in a Docker container" \
      Maintainer="jguzman.07@icloud.com"

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary application files into the container
COPY src/ .

# Install any needed packages specified in requirements.txt
RUN --mount=type=secret,id=secrets pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn

# Ensure a non-root user is used for added security
USER 1000

# Expose port 80 to the outside world
EXPOSE 80

# Set environment variable
ENV ENV=production

# HEALTHCHECK instructions
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:80/healthz || exit 1

# Run the application using a non-root user when the container starts
CMD ["gunicorn", "-b", "0.0.0.0:80", "app:app"]
