/* Servidor mínimo de Profundiza (sin dependencias).
   Sirve los archivos estáticos y expone /api/tutor (tutor Socrático vía DeepSeek).
   La API key se lee de la variable de entorno DEEPSEEK_API_KEY, nunca del código. */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const SYSTEM_PROMPT = `Eres un tutor Socrático para estudiantes de secundaria en México.
Tu misión: ayudar a un estudiante a COMPRENDER un texto y responder una pregunta de comprensión lectora.
Reglas estrictas:
1) NUNCA digas cuál es la respuesta correcta ni menciones la letra/opción correcta.
2) Guía con preguntas y pistas que hagan pensar, no des la solución.
3) Sé breve: máximo 60 palabras.
4) Si te piden directamente la respuesta, redirige con una pregunta en vez de responderla.
5) Habla en español, con tono cercano y motivador.`;

function socraticPrompt(payload) {
  return `TEXTO:
"""${payload.texto}"""

PREGUNTA DE COMPRENSIÓN:
${payload.pregunta}

OPCIONES:
${payload.opciones.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")}

El estudiante dice: "${payload.mensaje || "No entiendo, ayúdame"}"

Ayúdalo a razonar sin revelar la respuesta correcta.`;
}

async function streamTutor(payload, res) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("Falta DEEPSEEK_API_KEY en el entorno");

  const upstream = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: socraticPrompt(payload) },
      ],
      temperature: 0.6,
      max_tokens: 220,
      stream: true,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Error en el modelo (" + upstream.status + ")");
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const data = l.slice(5).trim();
      if (data === "[DONE]") { res.end("data: [DONE]\n\n"); return; }
      try {
        const j = JSON.parse(data);
        const delta = j.choices?.[0]?.delta?.content;
        if (delta) res.write(`data: ${JSON.stringify(delta)}\n\n`);
      } catch { /* línea parcial, ignorar */ }
    }
  }
  res.end("data: [DONE]\n\n");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 1e6) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); }
      catch (e) { reject(new Error("JSON inválido")); }
    });
    req.on("error", reject);
  });
}

function serveFile(res, urlPath) {
  let file = urlPath === "/" ? "index.html" : urlPath.slice(1);
  const abs = path.join(ROOT, path.normalize(file));
  if (!abs.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }

  fs.readFile(abs, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("No encontrado");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(abs)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "POST" && url.pathname === "/api/tutor") {
    try {
      const payload = await readBody(req);
      await streamTutor(payload, res);
    } catch (e) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      }
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  if (req.method === "GET") return serveFile(res, url.pathname);

  res.writeHead(405);
  res.end("Método no permitido");
});

server.listen(PORT, () => {
  console.log(`Profundiza corriendo en http://localhost:${PORT}`);
  console.log(`Tutor IA: ${process.env.DEEPSEEK_API_KEY ? "CONECTADO" : "SIN KEY (define DEEPSEEK_API_KEY)"}`);
});
