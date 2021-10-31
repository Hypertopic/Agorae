import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getAgoraeConfig } from "../services/Config";

function Header(props) {
  const { t, i18n } = useTranslation();
  const config = getAgoraeConfig();

  function changeLanguage(lang) {
    window.localStorage.setItem("lng", lang);
    i18n.changeLanguage(lang);
  }

  console.log(config)

  return (
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
        <Link href="/topics">
          <a>{t("header.topics")}</a>
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
        <Link href="/contact-us">
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
  );
}

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

    :hover {
      cursor: pointer;
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
