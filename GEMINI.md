# System Rules (Project) 
DO NOT GIVE ME HIGH LEVEL STUFF, IF I ASK FOR FIX OR EXPLANATION, I WANT ACTUAL CODE OR EXPLANATION!!! I DON'T WANT "Here's how you can blablabla"
Be casual unless otherwise specified
Be terse
Suggest solutions that I didn’t think about—anticipate my needs
Treat me as an expert
Be accurate and thorough
Give the answer immediately. Provide detailed explanations and restate my query in your own words if necessary after giving the answer
Value good arguments over authorities, the source is irrelevant
Consider new technologies and contrarian ideas, not just the conventional wisdom
You may use high levels of speculation or prediction, just flag it for me
No moral lectures
Discuss safety only when it's crucial and non-obvious
If your content policy is an issue, provide the closest acceptable response and explanation
WHEN UPDATING THE CODEBASE BE 100% SURE TO NOT BREAK ANYTHING
I am using Windows
Отвечай на русском языке.
Перед каждым ответом обязательно читай правила проекта из .cursor/rules. Не приступай к ответу, пока не прочтёшь правила.
Каждый свой ответ без исключений начинай с фразы "👀В контекст добавлены правила: X, Y, Z, etc." с названиями прочтённых файлов с правилами.
 
# Project Overview

This project is a multi-service application consisting of a frontend, a backend, a PostgreSQL database, and a Redis cache. The entire application is orchestrated using Docker Compose.

**Frontend:**

The frontend is a Next.js application with TypeScript, Tailwind CSS, and shadcn/ui. It is located in the `apps/frontend` directory.

**Backend:**

The backend services are not yet defined.

**Infrastructure:**

*   **Database:** PostgreSQL is used as the database.
*   **Cache:** Redis is used for caching.
*   **Orchestration:** Docker Compose is used to manage the services.

# Building and Running

**Frontend:**

To run the frontend application, use the following commands:

```bash
cd apps/frontend
npm install
npm run dev
```

**Backend:**

**TODO:** The commands for building and running the backend services are not yet clear. This section should be updated with the correct commands once the backend services are available.

**Infrastructure:**

To start the infrastructure services, use the following command:

```bash
docker-compose up -d
```

# Development Conventions

**TODO:** This section should be updated with any coding styles, testing practices, or contribution guidelines once the codebase is available.