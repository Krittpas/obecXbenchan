/** แปลงลิงก์ถ่ายทอดสดให้เป็น URL สำหรับฝังใน iframe */
export function toEmbedUrl(raw: string, siteHost?: string): string | null {
  const input = (raw ?? "").trim();
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  /* YouTube — รองรับทั้ง watch?v=, youtu.be/, live/ และ embed/ */
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const id =
      url.searchParams.get("v") ??
      (url.pathname.startsWith("/live/") ? url.pathname.slice(6) : null) ??
      (url.pathname.startsWith("/embed/") ? url.pathname.slice(7) : null);
    if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    return null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
  }

  /* Facebook — ใช้ปลั๊กอินวิดีโอ */
  if (host === "facebook.com" || host === "fb.watch" || host === "web.facebook.com") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(input)}&show_text=false`;
  }

  /* Twitch — ต้องระบุโดเมนที่ฝัง */
  if (host === "twitch.tv") {
    const channel = url.pathname.replace(/^\//, "").split("/")[0];
    if (!channel) return null;
    const parent = siteHost && siteHost !== "localhost" ? siteHost : "localhost";
    return `https://player.twitch.tv/?channel=${channel}&parent=${parent}`;
  }

  /* ลิงก์ฝังอื่นที่เตรียมมาเองแล้ว */
  if (url.pathname.includes("/embed") || url.pathname.includes("plugins/video")) return input;

  return null;
}

/** ชื่อแพลตฟอร์มไว้แสดงเป็นป้ายกำกับ */
export function streamPlatform(raw: string): string {
  const input = (raw ?? "").trim();
  if (!input) return "ถ่ายทอดสด";
  try {
    const host = new URL(input).hostname.replace(/^www\./, "");
    if (host.includes("youtu")) return "YouTube Live";
    if (host.includes("facebook") || host.includes("fb.watch")) return "Facebook Live";
    if (host.includes("twitch")) return "Twitch";
    return host;
  } catch {
    return "ถ่ายทอดสด";
  }
}
