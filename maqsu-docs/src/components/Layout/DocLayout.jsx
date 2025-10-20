import React from "react";

export default function DocLayout({ title, children }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>{title}</h1>
      <hr style={{ margin: "1.5rem 0", opacity: 0.3 }} />
      {children}
    </div>
  );
}
