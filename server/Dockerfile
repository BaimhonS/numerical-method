FROM golang:1.22-alpine3.19

WORKDIR /app

# Copy go.mod first (ถ้ามีแค่ go.mod)
COPY go.mod ./

# Initialize module and download dependencies
RUN go mod download && go mod tidy

# Copy the rest of the code
COPY . .

# Build
RUN go build -o main .

# Run
CMD ["/app/main"] 