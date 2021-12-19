import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getAgoraeConfig } from "../services/Config";
import Head from "next/head";

function Header(props) {
  const { t, i18n } = useTranslation();
  const config = getAgoraeConfig();

  function changeLanguage(lang) {
    window.localStorage.setItem("lng", lang);
    i18n.changeLanguage(lang);
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>
          {props.title} | {config.seo.title}{" "}
        </title>
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* SEO */}
        <meta name="description" content={config.seo.description} />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta property="og:site_name" content={config.seo.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={props.title + " | " + config.seo.title} />
        <meta property="og:description" content={props.desc} />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:url" content="/" />
        <meta property="og:image" content="/img/agorae.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title + " | " + config.seo.title} />
        <meta name="twitter:description" content={props.desc} />
        <meta name="twitter:url" content="/" />
        <meta name="twitter:image" content="/img/agorae.png" />
        <meta name="twitter:site" content={config.seo.twitter} />
        <meta property="og:site_name" content={config.seo.title}></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:locale" content="en-EN"></meta>
        <meta name="twitter:creator" content={config.seo.twitter}></meta>
        <meta name="theme-color" content={config.seo.theme_color}></meta>

        {/* SEO */}
      </Head>
      <HeaderBox>
        <LogoBox>
          <Link passHref href="/">
            <img src="/img/agorae-simple-logo.png" alt="Agorae Logo picture" />
          </Link>
          <div className="title">{config.website.title}</div>
          <div className="minidesc">{config.website.secondary_title}</div>
        </LogoBox>
        <SearchBox>
          <input type="text" placeholder={t("header.search")} name="" id="" />
        </SearchBox>
        <RightBox>
          <Link href="/corpus">
            <a>{t("header.corpus")}</a>
          </Link>
          <Link href="/viewpoint">
            <a>{t("header.viewpoint")}</a>
          </Link>
          <Link href="/about">
            <a>{t("header.about")}</a>
          </Link>
          <Link href="/propose">
            <a>{t("header.propose")}</a>
          </Link>
          <Link href="/faq">
            <a>{t("header.faq")}</a>
          </Link>
          <Link href="/contact">
            <a>{t("header.contact-us")}</a>
          </Link>

          <Link href="">
            <a
              onClick={() => {
                changeLanguage("fr");
              }}
              style={{ fontSize: "small" }}
            >
              {" "}
              FR 🇫🇷{" "}
            </a>
          </Link>
          <Link href="">
            <a
              onClick={() => {
                changeLanguage("en");
              }}
              style={{ fontSize: "small" }}
            >
              {" "}
              EN 🇬🇧{" "}
            </a>
          </Link>
        </RightBox>
      </HeaderBox>
    </>
  );
}


/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs 
 */

const HeaderBox = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  background-color: rgba(255, 255, 255, 0.8);
  height: 50px;
  box-shadow: 0px 14px 62px rgba(0, 0, 0, 0.06);
  justify-content: space-around;
  display: flex;
`;

const LogoBox = styled.div`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  color: #4b4a4a;
  img {
    margin-top: auto;
    margin-bottom: auto;
    width: 35px;
    margin-right: 10px;
    transition:  0.3s;

    :hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
  .title {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 20px;
  }
  .minidesc {
    margin-top: auto;
    margin-bottom: auto;
    padding-left: 10px;
    font-weight: 400;
    font-size: 13px;
    font-family: "Domine", serif;
  }
`;

const SearchBox = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  width: 600px;
  input[type="text"] {
    height: 28px;
    background: #0144621c;
    border-radius: 5px;

    border: none;
    text-align: center;
    padding-left: 19px;
    width: 100%;
  }

  input[type="text"]::placeholder {
    color: #01153277;
  }
`;

const RightBox = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  a {
    padding-left: 20px;
    font-weight: 500;
    color: #4b4a4a;
    font-size: 16px;
  }

  span {
    font-size: 17px;
  }
`;
export default Header;
