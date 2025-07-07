# Codex Frontend

This is the Next.js frontend for the Codex Personal Knowledge Management application. It provides the user interface for interacting with the `codex-backend` API.

## Features

- **Next.js 14 App Router:** A modern, fast, and scalable React framework.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **API Integration:** Fetches and displays data from the live backend.
- **Docker-ready:** Includes a multi-stage `Dockerfile` optimized for production.

---

## Local Development

### Prerequisites

- Node.js (v18+)
- npm (or pnpm/yarn)

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-frontend-repo-url>
    cd codex-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a local environment file:**
    Create a file named `.env.local` in the root of the project. This file tells your local dev server where to find the backend API.
    
    **IMPORTANT:** Use the full public URL of your backend, including the `/api` part.
    ```env
    # .env.local
    NEXT_PUBLIC_API_URL=https://codex.flexxor.duckdns.org/
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the app. It should connect to your live backend and display your notebooks.

---

## Docker Deployment

This project is designed to be deployed as part of the main Codex `docker-compose.yml` stack.

### 1. Build & Push the Image

You will use a GitHub Action similar to the backend to automatically build and push the image. The action will need to pass the `NEXT_PUBLIC_API_URL` as a build argument.

### 2. Update Your Portainer Stack

In your main Codex `docker-compose.yml` in Portainer, update the `codex-frontend` service.

```yaml
services:
  # ... other services ...

  codex-frontend:
    # REMOVE the placeholder image
    # image: nginx:alpine

    # ADD your real frontend image
    image: bfizzle01/links:latest
    container_name: codex-frontend
    restart: unless-stopped
    networks:
      - codex-net
    ports:
      # Map host port 8088 to the container's port 3000 (where Next.js runs)
      - '8088:3000'
    build:
      # We add a build section to pass the environment variable
      # Note: This is an example, this part is best handled by the GitHub Action
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      - codex-backend
