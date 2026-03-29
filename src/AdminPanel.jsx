// AdminPanel.jsx — ადმინ პანელი
// გახსენი: http://localhost:3000/admin
// დაამატე App.js Router-ში ან ცალკე გაუშვი

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
const ADMIN_PASS = "admin123"; // შეცვალე!

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [chats, setChats] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!auth) return;
    const socket = io(SOCKET_URL, { query: { role: "admin" } });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // ახალი შეტყობინება მომხმარებლისგან
    socket.on("new_user_message", ({ sessionId, text, time, name }) => {
      setChats(prev => ({
        ...prev,
        [sessionId]: {
          ...(prev[sessionId] || { name: name || sessionId, unread: 0 }),
          messages: [...(prev[sessionId]?.messages || []), { text, from: "user", time }],
          unread: activeChat === sessionId ? 0 : (prev[sessionId]?.unread || 0) + 1,
          lastMsg: text,
          lastTime: time,
        }
      }));
    });

    // ყველა არსებული ჩატი
    socket.on("all_chats", (data) => setChats(data));

    return () => socket.disconnect();
  }, [auth]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChat]);

  const login = () => {
    if (pass === ADMIN_PASS) setAuth(true);
    else alert("არასწორი პაროლი!");
  };

  const send = () => {
    if (!input.trim() || !activeChat) return;
    const time = new Date().toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" });
    const msg = { text: input, from: "admin", time };

    setChats(prev => ({
      ...prev,
      [activeChat]: {
        ...prev[activeChat],
        messages: [...(prev[activeChat]?.messages || []), msg],
        lastMsg: input, lastTime: time,
      }
    }));

    socketRef.current?.emit("admin_message", { sessionId: activeChat, text: input, time });
    setInput("");
  };

  const markRead = (sessionId) => {
    setActiveChat(sessionId);
    setChats(prev => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], unread: 0 }
    }));
  };

  const totalUnread = Object.values(chats).reduce((s, c) => s + (c.unread || 0), 0);

  // ── LOGIN ──
  if (!auth) return (
    <div style={{ minHeight: "100vh", background: "#F7F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px", width: 360, boxShadow: "0 8px 40px rgba(44,36,22,.12)", border: "1px solid rgba(139,105,20,.1)", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏡</div>
        <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>ადმინ პანელი</h2>
        <p style={{ color: "#6B5A3A", fontSize: 14, marginBottom: 24 }}>ციხისძირი კოტეჯები</p>
        <input
          type="password"
          placeholder="პაროლი"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          style={{ width: "100%", background: "#F7F4EE", border: "1px solid rgba(139,105,20,.2)", borderRadius: 10, padding: "12px 16px", fontSize: 15, fontFamily: "inherit", marginBottom: 14, boxSizing: "border-box" }}
        />
        <button onClick={login} style={{ width: "100%", background: "linear-gradient(135deg,#8B6914,#D4A942)", border: "none", color: "#fff", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>შესვლა →</button>
      </div>
    </div>
  );

  const activeMsgs = activeChat ? chats[activeChat]?.messages || [] : [];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EE", fontFamily: "'Crimson Pro', Georgia, serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes msgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(139,105,20,.2); border-radius: 4px; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg,#8B6914,#D4A942)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🏡</span>
          <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>ადმინ პანელი</span>
          {totalUnread > 0 && (
            <span style={{ background: "#EF4444", color: "#fff", padding: "2px 8px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{totalUnread} ახალი</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#4ADE80" : "#9CA3AF" }} />
          <span style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>{connected ? "დაკავშირებული" : "გათიშული"}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 56px)" }}>

        {/* Sidebar — ჩატების სია */}
        <div style={{ width: 280, background: "#fff", borderRight: "1px solid rgba(139,105,20,.1)", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "16px", borderBottom: "1px solid rgba(139,105,20,.08)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#8B6914" }}>ჩატები ({Object.keys(chats).length})</div>
          </div>
          {Object.keys(chats).length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#A08050", fontSize: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
              ჯერ შეტყობინება არ არის
            </div>
          )}
          {Object.entries(chats).map(([sid, chat]) => (
            <div key={sid} onClick={() => markRead(sid)} style={{
              padding: "14px 16px", cursor: "pointer",
              background: activeChat === sid ? "rgba(139,105,20,.06)" : "transparent",
              borderLeft: activeChat === sid ? "3px solid #D4A942" : "3px solid transparent",
              borderBottom: "1px solid rgba(139,105,20,.06)",
              transition: "all .2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#2C2416" }}>👤 {chat.name || sid.slice(0, 10)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {chat.unread > 0 && (
                    <span style={{ background: "#EF4444", color: "#fff", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{chat.unread}</span>
                  )}
                  <span style={{ fontSize: 11, color: "#A08050" }}>{chat.lastTime}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#6B5A3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMsg || "..."}</div>
            </div>
          ))}
        </div>

        {/* Main — ჩატის ფანჯარა */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!activeChat ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#A08050", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>აირჩიე ჩატი</div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: "14px 20px", background: "#fff", borderBottom: "1px solid rgba(139,105,20,.1)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,105,20,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{chats[activeChat]?.name || activeChat.slice(0, 12)}</div>
                  <div style={{ fontSize: 12, color: "#6B5A3A" }}>{activeMsgs.length} შეტყობინება</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12, background: "#FAFAF7" }}>
                {activeMsgs.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.from === "admin" ? "flex-end" : "flex-start", animation: "msgIn .25s both" }}>
                    <div style={{
                      maxWidth: "70%",
                      background: msg.from === "admin" ? "linear-gradient(135deg,#8B6914,#D4A942)" : "#fff",
                      color: msg.from === "admin" ? "#fff" : "#2C2416",
                      padding: "10px 14px",
                      borderRadius: msg.from === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontSize: 14, lineHeight: 1.5,
                      boxShadow: "0 2px 8px rgba(44,36,22,.08)",
                      border: msg.from === "user" ? "1px solid rgba(139,105,20,.1)" : "none",
                    }}>
                      {msg.text}
                      <div style={{ fontSize: 10, opacity: .6, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "14px 20px", background: "#fff", borderTop: "1px solid rgba(139,105,20,.1)", display: "flex", gap: 10 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="პასუხი..."
                  style={{ flex: 1, background: "#F7F4EE", border: "1px solid rgba(139,105,20,.15)", borderRadius: 10, padding: "11px 16px", fontSize: 14, fontFamily: "inherit", color: "#2C2416", outline: "none" }}
                />
                <button onClick={send} style={{ background: "linear-gradient(135deg,#8B6914,#D4A942)", border: "none", color: "#fff", padding: "11px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>გაგზავნა →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
