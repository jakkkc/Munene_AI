function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="logo">
            <div className="logo-icon">M</div>
            Munene AI
          </a>
          <ul className="nav-links">
            <li>
              <a href="#how-it-works">Jinsi Inavyofanya</a>
            </li>
            <li>
              <a href="#pricing">Bei</a>
            </li>
            <li>
              <a href="#waitlist" className="nav-cta">
                Anza Sasa
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span />
            Inapatikana kwenye WhatsApp
          </div>
          <h1>Simamia Biashara Yako Kwa Akili</h1>
          <p className="hero-subtitle">
            The AI business advisor in your WhatsApp
          </p>
          <a href="#waitlist" className="hero-cta">
            Anza Sasa — Ni Bure Kuanza
          </a>
          
            href="/chat"
            className="hero-cta"
            style={{
              backgroundColor: "#fff",
              color: "#1a6b3c",
              marginTop: "12px",
              display: "inline-block",
            }}
          >
          Jaribu Munene AI &#8594;
          </a>
          <div className="hero-trust">
            <div className="hero-trust-item">
              <CheckIcon />
              Kwa wafanyabiashara wadogo
            </div>
            <div className="hero-trust-item">
              <CheckIcon />
              Hakuna programu ya kupakua
            </div>
            <div className="hero-trust-item">
              <CheckIcon />
              Futa wakati wowote
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="section-inner">
          <span className="section-label">Jinsi Inavyofanya</span>
          <h2 className="section-title">Rahisi Sana — Hatua 3 Tu</h2>
          <p className="section-desc">
            Hakuna hesabu ngumu. Tumia WhatsApp tu, kama unavyozungumza na
            rafiki.
          </p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Tuma Mauzo Yako Kila Siku</h3>
              <p>
                Send your daily sales on WhatsApp. Andika tu &quot;Leo nimeuza
                bidhaa za KSh 5,000&quot; — AI inaelewa.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Inafuatilia Kila Kitu</h3>
              <p>
                AI tracks everything automatically. Mauzo, matumizi, na faida —
                yote yameandikwa bila kazi yako.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pata Ripoti na Ushauri</h3>
              <p>
                Get weekly profit reports and smart advice. Jua biashara yako
                inaenda wapi na nini cha kuboresha.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="section-inner">
          <span className="section-label">Bei</span>
          <h2 className="section-title section-title--center">
            Bei Rahisi, Thamani Kubwa
          </h2>
          <p className="section-desc section-desc--center">
            Kwa bei ya chakula cha mchana, pata msaidizi wa biashara kila siku.
          </p>
          <div className="pricing-card">
            <p className="plan-name">Mpango wa Mwezi</p>
            <div className="pricing-amount">
              <span className="currency">KSh</span>
              <span className="price">299</span>
              <span className="period">/month</span>
            </div>
            <p className="pricing-note">Cancel anytime — hakuna mkataba</p>
            <ul className="pricing-features">
              <li>
                <CheckIcon />
                Ufuatiliaji wa mauzo kila siku
              </li>
              <li>
                <CheckIcon />
                Ripoti ya faida kila wiki
              </li>
              <li>
                <CheckIcon />
                Ushauri wa biashara kutoka AI
              </li>
              <li>
                <CheckIcon />
                Inafanya kazi kwenye WhatsApp
              </li>
            </ul>
            <a href="#waitlist" className="pricing-cta">
              Anza Sasa
            </a>
          </div>
        </div>
      </section>

      <section className="waitlist" id="waitlist">
        <div className="waitlist-wrapper">
          <span className="section-label">Anza Sasa</span>
          <h2 className="section-title">Ongea na Munene AI Sasa Hivi</h2>
          <p className="section-desc">
            Bonyeza kitufe hapa chini. Utaunganishwa na Munene AI moja kwa moja
            kwenye WhatsApp yako.
          </p>
          
            href="https://wa.me/14155238886?text=join%20slight-wonder"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#25D366",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: "700",
              textDecoration: "none",
              marginTop: "16px",
              boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Anza na Munene AI — Bure!
          </a>
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#888" }}>
            Hakuna app ya kupakua. WhatsApp tu. 🇰🇪
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="logo">
                <div className="logo-icon">M</div>
                Munene AI
              </a>
              <p>
                Msaidizi wa biashara unaotumia akili bandia, moja kwa moja
                kwenye WhatsApp yako. Kwa wamiliki wa duka, kioski, na
                wafanyabiashara wadogo nchini Kenya.
              </p>
            </div>
            <div className="footer-links">
              <h4>Ukurasa</h4>
              <ul>
                <li>
                  <a href="#how-it-works">Jinsi Inavyofanya</a>
                </li>
                <li>
                  <a href="#pricing">Bei</a>
                </li>
                <li>
                  <a href="#waitlist">Anza Sasa</a>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Mawasiliano</h4>
              <ul>
                <li>
                  <a href="mailto:jacmwnaiki@gmail.com">jacmwnaiki@gmail.com</a>
                </li>
                <li>
                  
                    href="https://wa.me/14155238886?text=join%20slight-wonder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 Munene AI. Haki zote zimehifadhiwa.</span>
            <span>Made with ❤️ in Kenya</span>
          </div>
          <div className="footer-credit">
            
              href="https://nex-chi-six.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built by Jackson_Mwaniki_Munene
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}