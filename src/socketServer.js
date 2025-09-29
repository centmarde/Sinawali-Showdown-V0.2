const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"], // Allow both
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected.");

  socket.on("attack", (data) => {
    socket.broadcast.emit("animation_update", { data });
  });

  socket.on("buff", (data) => {
    socket.broadcast.emit("animation_update", { data });
  });

  socket.on("hurt", (data) => {
    socket.broadcast.emit("animation_update", { data });
  });

  socket.on("attack2", (data) => {
    socket.broadcast.emit("animation_update2", { data });
  });

  socket.on("buff2", (data) => {
    socket.broadcast.emit("animation_update2", { data });
  });

  socket.on("hurt2", (data) => {
    socket.broadcast.emit("animation_update2", { data });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

httpServer.listen(3002, () => {
  console.log("Server is running on port 3002.");
});
