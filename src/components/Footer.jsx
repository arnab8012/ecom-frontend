import { Link, useLocation } from "react-router-dom";
import "../styles/footer.css";
import logo from "../assets/logo.png";

export default function Footer() {
  const { pathname } = useLocation();

  // ✅ admin panel এ footer দেখাবে না
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="siteFooter">
      <div className="footerCard">
        {/* Top brand row */}
        <div className="footerBrand">
          <div className="footerLogoWrap">
            <img
              className="footerLogo"
              src={logo}
              alt="The Curious Empire"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="footerBrandText">
            <h3 className="footerTitle">The Curious Empire</h3>

            <p className="footerDesc">
              ✨ Premium Shopping Experience — Unique products delivered with quality & care.
            </p>

            <div className="footerSocial">
              <a
                className="socBtn"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                className="socBtn"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                ▶
              </a>
              <a
                className="socBtn"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ⌁
              </a>
              <a
                className="socBtn"
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                ♪
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="footerGrid">
          <div className="footerCol">
            <h4 className="footerH">Quick Links</h4>
            <Link className="footerLink" to="/shop">› Shop</Link>
            <Link className="footerLink" to="/shop?offer=1">› Offers</Link>
            <Link className="footerLink" to="/shop?sort=top">› Top Sales</Link>
            <Link className="footerLink" to="/shop">› All Products</Link>
          </div>

          <div className="footerCol">
            <h4 className="footerH">Account</h4>
            <Link className="footerLink" to="/profile">› My Account</Link>
            <Link className="footerLink" to="/favorites">› Priyo</Link>
            <Link className="footerLink" to="/cart">› Cart</Link>
            <Link className="footerLink" to="/settings">› Settings</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="footerBottom">
          <span>
            © {new Date().getFullYear()} The Curious Empire. All rights reserved.
          </span>
        </div>

        {/* ✅ Developer credit (এটা footerCard এর ভিতরে রাখতে হবে) */}
        <div className="footerDev">
          <img
            src="/dev.png"
            alt="Developer"
            className="footerDevImg"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="footerDevText">
            THIS WEBSITE DEVELOPED BY <strong>ARNAB CHOWDHURY (TONY)</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}