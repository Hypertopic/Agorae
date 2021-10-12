import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <HeaderBox>
      <LogoBox>
        <img src="/img/agorae-simple-logo.png" alt="Agorae Logo picture" />
        <div className="title">Agorae</div>
      </LogoBox>
      <SearchBox>
        <input type="text" placeholder="Search for topics, names, authors and more" name="" id="" />
      </SearchBox>
      <RightBox>
        <Link href="/topics">
          <a>Topics</a>
        </Link>
        <Link href="">
          <a>About</a>
        </Link>
        <Link href="">
          <a>Propose new Item</a>
        </Link>
        <Link href="">
          <a>FAQ</a>
        </Link>
        <Link href="">
          <a>Contact Us</a>
        </Link>
        <Link href="">
          <a>
            <span className="material-icons">language</span>
          </a>
        </Link>
      </RightBox>
    </HeaderBox>
  );
}

const HeaderBox = styled.div`
  background-color: white;
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
  img {
    margin-top: auto;
    margin-bottom: auto;
    width: 40px;
    margin-right: 10px;
  }
  .title {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 20px;
  }
`;

const SearchBox = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  width: 600px;
  input[type="text"] {
    height: 28px;
    background: #f5f5f5;
    border-radius: 5px;

    border: none;
    text-align: center;
    padding-left: 19px;
    width: 100%;
  }

  input[type="text"]::placeholder {
    opacity: 0.5;
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

  span{
    font-size: 17px;
  }
`;
export default Header;
