# Use an official lightweight Go image
FROM golang:1.23 as builder

# Set working directory inside the container
WORKDIR /app

# Copy backend files
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip libwebp-dev

# Install Python packages
RUN pip3 install yt-dlp

# Download Go dependencies and build the binary
RUN go mod tidy && go build -o server .

# Use a smaller runtime image
FROM debian:bullseye-slim

# Set working directory inside the container
WORKDIR /app

# Copy the built Go binary from the builder stage
COPY --from=builder /app/server .

# Copy required system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip libwebp-dev

# Install Python packages again in the runtime container
RUN pip3 install yt-dlp

# Expose the port your Go app listens on
EXPOSE 8080

# Run the Go server
CMD ["./server"]
