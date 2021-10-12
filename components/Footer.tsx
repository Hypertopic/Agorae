import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <FooterBox>
      <span>© 2021 Agorae v2.0.1</span>
    </FooterBox>
  );
}

const FooterBox = styled.div`
  position: fixed;
  text-align: center;
  bottom: 0;
  top: auto;
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  background-color: rgba(255, 255, 255, 0.8);
  color: #000;
  border: solid;
  border-width: 0.1px;
  border-color: #2020200d;
  font-size: 0.7em;
  height: 3em;
  padding-top: 1em;
  width: 100%;
  box-shadow: 0px 14px 62px rgb(0 0 0 / 6%);
`;

export default Footer;
