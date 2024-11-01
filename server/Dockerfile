FROM golang:1.22-alpine3.19

WORKDIR /app

# Copy go.mod first
COPY go.mod go.sum ./

# Initialize module and download dependencies
RUN go mod download && go mod tidy

# Copy the rest of the code
COPY . .

# Build
RUN go build -o main .

# Run
CMD ["/app/main"] 