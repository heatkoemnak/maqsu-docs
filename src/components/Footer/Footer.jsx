import React from "react";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer
      className="bottom"
      style={{
        background: "#411530",
        color: "#ffffff",
        textAlign: "justify",
        bottom: 0,
        width: "100%",
        position: " absolute",
        margin: 0,
        padding: 0,
        borderSize: "border-box"
      }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossorigin="anonymous"
        />
      </head>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col 12">
            <div>
              <span style={{ display: "inline-block", marginTop: 5 }}>
                Contact Us
              </span>

              <ul>
                <li>
                  <i class="fa fa-envelope"></i> info@3ieducation.com
                </li>
                <li>
                  <i class="fa fa-phone"></i> +91-7291007617
                </li>
                <li>
                  <i class="fa fa-map-marker"></i> FF 11 A, Sunrise Mall, Sector
                  11, Vasundhara, Ghaziabad Delhi NCR
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-4 col-12" style={{ marginTop: 10 }}>
            <h4 style={{ color: "lightgrey" }}>&nbsp;</h4>
          </div>
          <div className="col-md-4 col-12" style={{ marginTop: 10 }}>
            <h4 style={{ color: "lightgrey", textAlign: "justify" }}>
              {" "}
              Terms & Policies{" "}
            </h4>
            <nav className="Navfooter">
              <ul className="list-unstyled">
                <li>
                  <a href="privacy-policy.html">Privacy Policy</a>
                </li>
                <li>
                  <a href="terms-and-conditions.html">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="refund-policy.html">Refund Policy</a>
                </li>
                <li>
                  <a href="disclaimer-policy.html">Disclaimer Policy</a>
                </li>
              </ul>
            </nav>
          </div>

          <div className=" col-12" style={{ fontSize: 14, color: "lightgrey" }}>
            &copy; {new Date().getFullYear()} ©Genex Learning Systems | All
            Rights Reserved
            <i
              class="fa fa-facebook-official"
              aria-hidden="true"
              style={{ padding: 10, color: "white", float: "right" }}
            >
              {" "}
            </i>
            <i
              class="fa fa-twitter-square"
              aria-hidden="true"
              style={{ padding: 10, color: "white", float: "right" }}
            ></i>
            <i
              class="fa fa-github-square"
              aria-hidden="true"
              style={{ padding: 10, color: "white", float: "right" }}
            ></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
