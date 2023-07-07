// Frontend - App.js

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./App.css";

function App() {
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!senderEmail || !recipientEmail || !subject || !message) {
      toast.error(
        "Please make sure to fill all the required fields: sender email, recipient email, subject, and message."
      );
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("senderEmail", senderEmail);
      formData.append("recipientEmail", recipientEmail);
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("attachment", e.target.attachment.files[0]);

      const { data } = await axios.post("http://localhost:3001/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      toast.success(data.status === "success" ? "Email sent!" : "Email sending failed!");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while sending the email."
      );
    }
  };

  return (
    <div className="App">
      <section>
        <ToastContainer position="top-center" limit={1} />
        <form onSubmit={submitHandler}>
          <h1>Send Email</h1>
          <div className="form-wrapper">
            <div>
              <label htmlFor="senderEmail">Sender Email Address</label>
              <input
                onChange={(e) => setSenderEmail(e.target.value)}
                type="email"
                id="senderEmail"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="recipientEmail">Recipient Email Address</label>
              <input
                onChange={(e) => setRecipientEmail(e.target.value)}
                type="email"
                id="recipientEmail"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="subject">Email Subject</label>
              <input
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                id="subject"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="message">Message Body</label>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                id="message"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="attachment">Attachment</label>
              <input type="file" id="attachment" name="attachment" />
            </div>
            <div>
              <button disabled={loading} type="submit">
                {loading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default App;
