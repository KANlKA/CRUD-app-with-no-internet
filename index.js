const http = require("http");

const items = {};
let next = 1;

http.createServer((req, res) => {
  let body = "";
  req.on("data", c => (body += c));
  req.on("end", () => {
    const id = req.url.split("/")[2];
    const send = (data, code = 200) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    if (req.method === "POST") {                    // Create
      items[next] = JSON.parse(body).name;
      return send({ id: next++ }, 201);
    }
    if (!id) return send(items);                    // Read all
    if (!(id in items)) return send({ error: "not found" }, 404);

    if (req.method === "GET") send({ id, name: items[id] });          // Read one
    else if (req.method === "PUT") {                                  // Update
      items[id] = JSON.parse(body).name;
      send({ ok: true });
    } else if (req.method === "DELETE") {                             // Delete
      delete items[id];
      send({ ok: true });
    }
  });
}).listen(8000);
