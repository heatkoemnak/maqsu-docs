import React from "react";

export default function DocLayout({ title, children }) {
  return (
    <div style={{ maxWidth: "100%", margin: "0 auto",}}>
      <div>
        <a href="/" style={{ textDecoration: "none", color: "#333", fontSize: "1.2rem" }}>
          &larr; Back to Home
        </a>
      </div>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>{title}</h1>
      <hr style={{ margin: "1.5rem 0", opacity: 0.3 }} />
      {children}
      <div>
        <hr style={{ margin: "1.5rem 0", opacity: 0.3 }} />
        <p style={{ fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
          © {new Date().getFullYear()} Maqsu Documentation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
