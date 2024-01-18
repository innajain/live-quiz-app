import { Socket, io } from "socket.io-client";

export class SocketManager {
  private static socket?: Socket;

  private constructor() {}

  public static connect() {
    if (SocketManager.socket) {
      return;
    }
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    SocketManager.socket = socket;
  }

  public static disconnect() {
    if (!SocketManager.socket) {
      return;
    }
    SocketManager.socket.disconnect();
    SocketManager.socket = undefined;
  }
  public static getSocket(): Socket | undefined {
    return SocketManager.socket;
  }

  public static isConnected(): boolean {
    return SocketManager.socket !== undefined;
  }

  public static joinQuiz({ quizId, userId }: { quizId: string; userId: string }) {
    if (!SocketManager.socket) {
      return;
    }
    SocketManager.socket.emit("joinQuiz", { quizId, userId });
  }
}

// Add event listeners and perform actions with the socket
