const g = globalThis;
if (!g.__msgs) g.__msgs = [];

async function loadList() {
  try {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("portfolio-messages");
    const raw = await store.get("all");
    if (!raw) return [];
    const list = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return g.__msgs || [];
  }
}

async function saveList(list) {
  g.__msgs = list;
  try {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("portfolio-messages");
    await store.set("all", JSON.stringify(list));
  } catch (e) {}
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-code",
    "Content-Type": "application/json",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  let data = {};
  try { data = JSON.parse(event.body || "{}"); } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Invalid JSON" }) };
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  const subject = String(data.subject || "General Inquiry").trim();
  const service = String(data.service || "").trim() || null;

  if (!name || !email || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Name, email and message required" }) };
  }

  const entry = {
    id: Date.now(),
    name, email, subject, message, service,
    created_at: new Date().toISOString(),
    is_read: false,
  };

  const list = await loadList();
  list.unshift(entry);
  await saveList(list.slice(0, 300));

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true, msg: "Message saved" }) };
};
