// websocket.js
let socket = null;

const connectWebSocket = () => {
  const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  socket = new WebSocket(url);

  // Conexión establecida
  socket.onopen = () => {
    console.log("Conexión WebSocket establecida");
  };

  // Mensaje recibido
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Mensaje recibido:", message);
    // Actualiza el estado de tu aplicación o realiza acciones adicionales según el mensaje recibido
  };

  // Error de conexión
  socket.onerror = (error) => {
    console.error("Error en la conexión WebSocket:", error);
  };

  // Cierre de conexión
  socket.onclose = () => {
    console.log("Conexión WebSocket cerrada");

    // Intenta reconectar después de un breve período de tiempo
    setTimeout(() => {
      connectWebSocket();
    }, 3000); // Intenta reconectar cada 3 segundos (puedes ajustar este valor según tus necesidades)
  };
};

const getWebSocketInstance = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectWebSocket();
  }

  return socket;
};

export { getWebSocketInstance };
