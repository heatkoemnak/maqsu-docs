import React from "react";
import "./support.css";

export default function SupportPage() {
  return (
    <div className="support-container">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>
      <div className="support-wrapper">
        {/* Left Section */}
        <div className="support-info">
          <h1>Support Center</h1>
          <p>
            We're here to help! Reach out to us through any of the methods below
            or send us a message directly.
          </p>

          <div className="support-cards">
            <div className="support-card">
              <h3>Email Support</h3>
              <p>support@example.com</p>
            </div>

            <div className="support-card">
              <h3>Phone Support</h3>
              <p>+1 (123) 456-7890</p>
            </div>

            <div className="support-card">
              <h3>Help Center</h3>
              <p>Browse FAQs and guides</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="support-form-card">
          <h2>Send Us a Message</h2>
          <form className="support-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Type your message here..."></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
