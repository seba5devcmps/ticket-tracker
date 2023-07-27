"use client";

import { useState, useEffect, useContext, createContext } from "react";

const SocketContext = createContext();

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const connect = () => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const newSocket = new WebSocket(url);
    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  const sendMessage = (message) => {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));

        socket.addEventListener("message", (event) => {
          const response = JSON.parse(event.data);
          resolve(response);
        });

        socket.addEventListener("error", (event) => {
          reject(event.error);
        });
      } else {
        if (!socket) {
          // Si el socket no existe, intentamos conectarnos automáticamente
          connect();
        } else if (socket.readyState === WebSocket.CLOSED) {
          // Si el socket está cerrado, intentamos reconectar automáticamente
          connect();
        }

        // Esperamos 1 segundo para asegurarnos de que la conexión se haya establecido antes de enviar el mensaje
        setTimeout(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));

            socket.addEventListener("message", (event) => {
              const response = JSON.parse(event.data);
              resolve(response);
            });

            socket.addEventListener("error", (event) => {
              reject(event.error);
            });
          } else {
            reject("Socket is not open");
          }
        }, 1000);
      }
    });
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("Mensaje recibido:", message);
      });

      socket.addEventListener("error", (event) => {
        setError(event);
        disconnect();
      });

      socket.addEventListener("close", (event) => {
        setError("Socket closed");
        setSocket(null);
      });
    }
  }, [socket]);

  return { socket, connect, disconnect, sendMessage, messages, error };
};

const SocketProvider = ({ children }) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketProvider, useSocketContext };
