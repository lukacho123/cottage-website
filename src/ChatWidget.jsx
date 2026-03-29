// ChatWidget.jsx — საიტზე ჩასმული Chat ღილაკი
// დაამატე App.js-ში: import ChatWidget from './ChatWidget';
// და </> წინ: <ChatWidget />

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://cottage-backend-production.up.railway.app";
const AUTO_REPLY = "გამარჯობა! 👋 მადლობა რომ დაგვიკავშირდით. ჩვენ მალე გიპასუხებთ. საგადაუდებელო შემთხვევაში დაგვიკავშირდით: +995 595 772 088";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => "user_" + Math.random().toString(36).slice(2, 9));
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { query: { sessionId, role: "user" } });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    });

    socket.on("admin_typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    });

    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), text: input, from: "user", time: new Date().toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, msg]);
    socketRef.current?.emit("user_message", { sessionId, text: input });
    setInput("");

    // ავტომატური პასუხი თუ პირველი შეტყობინებაა
    if (messages.filter(m => m.from === "user").length === 0) {
      setTyping(true);
      setTimeout(() => {
        const autoMsg = { id: Date.now() + 1, text: AUTO_REPLY, from: "admin", time: new Date().toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" }) };
        setMessages(prev => [...prev, autoMsg]);
        setTyping(false);
      }, 1500);
    }
  };

  return (
    <>
      <style>{`
        @keyframes chatPop { from { opacity:0; transform:scale(.85) translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes msgIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
        @keyframes dot { 0%,80%,100% { opacity:.3; transform:translateY(0); } 40% { opacity:1; transform:translateY(-4px); } }
      `}</style>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 9998,
          width: 340, height: 480,
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(44,36,22,.2)",
          display: "flex", flexDirection: "column",
          overflow: "hidden", animation: "chatPop .3s cubic-bezier(.4,0,.2,1) both",
          fontFamily: "'Crimson Pro', Georgia, serif",
          border: "1px solid rgba(139,105,20,.12)",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#8B6914,#D4A942)",
            padding: "16px 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏡</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: connected ? "#4ADE80" : "#9CA3AF", border: "2px solid #D4A942" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>ციხისძირი კოტეჯები</div>
              <div style={{ color: "rgba(255,255,255,.75)", fontSize: 12 }}>{connected ? "● ონლაინ" : "○ ოფლაინ"}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, background: "#FAFAF7" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#A08050", fontSize: 13, marginTop: 40 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>👋</div>
                <div>გამარჯობა! რით შეგვიძლია დაგეხმაროთ?</div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                animation: "msgIn .25s both",
              }}>
                <div style={{
                  maxWidth: "80%",
                  background: msg.from === "user" ? "linear-gradient(135deg,#8B6914,#D4A942)" : "#fff",
                  color: msg.from === "user" ? "#fff" : "#2C2416",
                  padding: "10px 14px",
                  borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: 14, lineHeight: 1.5,
                  boxShadow: "0 2px 8px rgba(44,36,22,.08)",
                  border: msg.from === "admin" ? "1px solid rgba(139,105,20,.1)" : "none",
                }}>
                  {msg.text}
                  <div style={{ fontSize: 10, opacity: .6, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "#fff", borderRadius: "16px 16px 16px 4px", width: "fit-content", border: "1px solid rgba(139,105,20,.1)" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B6914", animation: `dot 1.2s ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(139,105,20,.1)", display: "flex", gap: 8, background: "#fff" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="შეტყობინება..."
              style={{
                flex: 1, background: "#F7F4EE",
                border: "1px solid rgba(139,105,20,.15)",
                borderRadius: 10, padding: "10px 14px",
                fontSize: 14, fontFamily: "inherit", color: "#2C2416",
                outline: "none",
              }}
            />
            <button onClick={send} style={{
              background: "linear-gradient(135deg,#8B6914,#D4A942)",
              border: "none", color: "#fff",
              width: 40, height: 40, borderRadius: 10,
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>→</button>
          </div>
        </div>
      )}

      {/* ── CHAT BUTTON ── */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        width: 58, height: 58, borderRadius: "50%",
        background: "linear-gradient(135deg,#8B6914,#D4A942)",
        border: "none", cursor: "pointer",
        boxShadow: "0 8px 28px rgba(139,105,20,.4)",
        fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .3s",
        animation: "pulse 3s ease-in-out infinite",
      }}>
        {open ? "✕" : "💬"}
        {unread > 0 && !open && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            background: "#EF4444", color: "#fff",
            width: 20, height: 20, borderRadius: "50%",
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>{unread}</div>
        )}
      </button>
    </>
  );
}
