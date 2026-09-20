const ADMIN_CODE = "MITELOOK2010";
const g = globalThis;
if (!g.__msgs) g.__msgs = [];

async function loadList() {
  try {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("portfolio-messages");
    const raw = await store.get("all");
    if (!raw) return g.__msgs || [];
    const list = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(list) ? list : (g.__msgs || []);
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

  const code = (event.headers["x-admin-code"] || event.headers["X-Admin-Code"] || "").trim();
  if (code !== ADMIN_CODE) {
    return { statusCode: 401, headers, body: JSON.stringify({ ok: false, error: "Invalid access code" }) };
  }

  if (event.httpMethod === "GET") {
    const list = await loadList();
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, messages: list }) };
  }

  if (event.httpMethod === "POST") {
    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch (e) {}
    let list = await loadList();

    if (body.action === "mark_read" && body.id != null) {
      list = list.map((m) => (String(m.id) === String(body.id) ? { ...m, is_read: true } : m));
    } else if (body.action === "mark_all") {
      list = list.map((m) => ({ ...m, is_read: true }));
    } else if (body.action === "delete" && body.id != null) {
      list = list.filter((m) => String(m.id) !== String(body.id));
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Unknown action" }) };
    }

    await saveList(list);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, messages: list }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ ok: false }) };
};
