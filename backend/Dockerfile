# Use an official Go image as the base
FROM golang:1.21-alpine  

# Install system dependencies
RUN apk update && apk add --no-cache python3 py3-pip libwebp  

# Install yt-dlp using pip
RUN pip3 install --no-cache-dir yt-dlp  

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
