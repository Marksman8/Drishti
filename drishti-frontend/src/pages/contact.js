import React from "react";
import "./contact.css";
import Navbar from "../components/Navbar";
import girlImg from "../assets/girl-study.png.png";
// If the above doesn't work, you may need to rename the image file to remove the double extension

// TEAM DATA (can later move to backend)
const teamMembers = [
  {
    name: "Yadu Krishnan M.S",
    role: "Project Coordinator & Communication Lead",
    bio: "Leads project coordination and manages communication across the team.",
    phone: "9605019474",
    email: "yadukrishnandrishti@proton.me",
    img: require("../assets/team1.jpg"),
  },
  {
    name: "Sreelakshmi Subhash",
    role: "Digital Outreach & Research Coordinator",
    bio: "Handles outreach strategies and coordinates research activities.",
    phone: "7736727710",
    email: "sreelakshmisubash0611@gmail.com",
    img: require("../assets/team2.jpg"),
  },
  {
    name: "Devika B",
    role: "Documentation & Knowledge Manager",
    bio: "Manages documentation and ensures proper knowledge organization.",
    phone: "9778581124",
    email: "devikab905@gmail.com",
    img: require("../assets/team3.jpg"),
  },
  {
    name: "Padmanabhan MJ",
    role: "Financial Literacy Facilitator & Media Coordinator",
    bio: "Focuses on financial awareness programs and media coordination.",
    phone: "8281758375",
    email: "padmanabhanmj10@gmail.com",
    img: require("../assets/team4.jpg"),
  },
  {
    name: "Vandana A",
    role: "Activity Design Facilitator & Finance Coordinator",
    bio: "Designs activities and assists in financial coordination.",
    phone: "8075885644",
    email: "vandanaas2005@gmail.com",
    img: require("../assets/team5.jpg"),
  },
];

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      {/* Background */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>
      <div className="bg-shape shape3"></div>
      <div className="gold-line gold-line1"></div>
      <div className="gold-line gold-line2"></div>

      <main className="contact-main">
        {/* TOP SECTION */}
        <section className="top-grid">
          <div className="left-col fade-up">
            <h1 className="main-title">
              Contact <span>Us</span>
            </h1>
            <div className="title-line"></div>

            <p className="main-subtitle">
              We’d love to hear from you. Reach out for inquiries,
              suggestions, or collaborations.
            </p>

            <div className="touch-card">
              <h2>
                Get In <span>Touch</span>
              </h2>

              <div className="touch-item">
                <div className="icon-circle">✉️</div>
                <div>
                  <p className="label">Email</p>
                  <p className="value">contact@drishti.org.in</p>
                </div>
              </div>

              <div className="touch-item">
                <div className="icon-circle">📞</div>
                <div>
                  <p className="label">Phone</p>
                  <p className="value">+91 98765 43210</p>
                </div>
              </div>

              <div className="touch-item">
                <div className="icon-circle">📍</div>
                <div>
                  <p className="label">Address</p>
                  <p className="value">
                    Amrita Vishwa Vidyapeetham, Amritapuri
                  </p>
                </div>
              </div>

              <div className="social-icons">
                <span>📸</span>
                <span>in</span>
                <span>🐦</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-col fade-up delay-1">
            <div className="girl-card float-card">
              <img src={girlImg} alt="Girl" className="girl-img" />
              <div className="floating bubble-blue">📞</div>
              <div className="floating bubble-gold">✉️</div>
              <div className="floating bubble-chat">💬</div>
            </div>

            <div className="form-card">
              <h2>
                Send Us A <span>Message</span>
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const subject = encodeURIComponent(`Drishti contact from ${fd.get('name') || 'visitor'}`);
                  const body = encodeURIComponent(
                    `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\nPhone: ${fd.get('phone')}\n\n${fd.get('message')}`
                  );
                  window.location.href = `mailto:contact@drishti.org.in?subject=${subject}&body=${body}`;
                }}
              >
                <div className="input-box">
                  <span>👤</span>
                  <input type="text" name="name" placeholder="Name" required />
                </div>

                <div className="input-box">
                  <span>✉️</span>
                  <input type="email" name="email" placeholder="Email" required />
                </div>

                <div className="input-box">
                  <span>📞</span>
                  <input type="text" name="phone" placeholder="Phone" />
                </div>

                <div className="input-box textarea-box">
                  <span>💬</span>
                  <textarea name="message" placeholder="Message" required></textarea>
                </div>

                <button className="send-btn" type="submit">
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bottom-grid">
          <div className="visit-block fade-up delay-2">
            <h3 className="section-title">
              Visit Us <span></span>
            </h3>

            <div className="map-card">
              <div className="map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.6683899864074!2d76.48924447426879!3d9.09394228797056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0602e7b4a2049d%3A0x3af3246b5138db0f!2sAmrita%20Vishwa%20Vidyapeetham%2C%20Amritapuri!5e0!3m2!1sen!2sin!4v1775927294381!5m2!1sen!2sin"
                  width="100%"
                  height="230"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="map-iframe"
                  title="Location"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="connect-card fade-up delay-3">
            <div className="connect-glow"></div>
            <div className="connect-head">
              <div className="connect-icon">🤝</div>
              <h3>Let’s Connect</h3>
            </div>

            <p>
              We’re always happy to hear from students, learners,
              and collaborators.
            </p>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="team-section fade-up">
          <h2 className="team-title">
            Meet Our <span>Team</span>
          </h2>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-img-wrapper">
                  <img src={member.img} alt={member.name} />
                </div>

                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
