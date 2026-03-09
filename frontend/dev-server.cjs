const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const port = Number(process.env.FRONTEND_PORT || 5173);
const frontendDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || "/");
  let pathname = parsed.pathname || "/";

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(frontendDir, pathname);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(frontendDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(normalized, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(normalized).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(port, () => {
  console.info(`Frontend dev server listening on http://localhost:${port}`);
  console.info("Backend API expected at http://localhost:3000");
});
