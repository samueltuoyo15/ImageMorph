# Use the latest official Go image that supports Go 1.23.4+
FROM golang:1.23.4-alpine  

# Install system dependencies (including WebP support)
RUN apk update && apk add --no-cache python3 py3-pip libwebp libwebp-dev build-base  

# Create a virtual environment for Python packages
RUN python3 -m venv /opt/venv  

# Activate the virtual environment and install yt-dlp
RUN /opt/venv/bin/pip install --no-cache-dir yt-dlp  

# Set environment variable so the app uses the virtual environment
ENV PATH="/opt/venv/bin:$PATH"  

# Enable CGO for WebP support
ENV CGO_ENABLED=1

# Set the working directory
WORKDIR /app  

# Copy Go files and dependencies
COPY go.mod go.sum ./
RUN go mod tidy  

# Copy the entire backend source code
COPY . .  

# Build the Go application
RUN go build -o server .  

# Expose the port your Go app runs on
EXPOSE 8080  

# Run the application
CMD ["./server"]
