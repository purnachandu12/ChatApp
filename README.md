# Real-time Chat Application

A modern, full-stack real-time chat application built with **Spring Boot (WebSocket)** and **React (Vite + Tailwind CSS)**.


## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSockets.
- **Multiple Rooms**: Create and join multiple chat rooms dynamically.
- **Global Login**: Simple username-based session management.
- **Persistent Chat History**: Messages are saved and loaded upon joining a room (In-Memory/DB depending on backend config).
- **Modern UI**:
  - **Dark Mode by Default**: Sleek, eye-friendly interface.
  - **Responsive Design**: Works on desktop and mobile.
  - **Live Status**: Real-time connection status indicators.

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) included with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: Spring Boot
- **Protocol**: WebSocket (STOMP/Native TextHandler)
- **Database**: H2 / MySQL (Configurable)

---

## 🏁 Getting Started

### 1. Backend Setup (Spring Boot)

1.  Clone the repository (or navigate to backend source).
2.  Open the project in IntelliJ IDEA or your preferred Java IDE.
3.  Ensure `Maven` dependencies are loaded.
4.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
5.  The server should start on `http://localhost:8080`.

### 2. Frontend Setup (React)

1.  Navigate to the frontend directory:
    ```bash
    cd chat-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rooms` | Create a new chat room |
| `GET` | `/api/rooms/{id}` | Get details of a specific room |
| `WS` | `/chat/{roomId}` | WebSocket connection endpoint |

## 📸 Usage

1.  **Enter Username**: On launch, enter your preferred username.
2.  **Create Room**: Click "Create Room", enter a name, and a new room ID is generated.
3.  **Join Room**: Click "Join Room", enter a known Room ID. The app will fetch the room name automatically.
4.  **Chat**: Type and send messages. You can switch between active rooms in the sidebar.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
