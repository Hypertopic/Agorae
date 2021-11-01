import React from "react";
import Link from "next/link";
import styled from "styled-components";

function PagesLinks({ pagesCount }) {
  const pagesArray = [];
  for (let i = 1; i <= pagesCount; i++) {
    pagesArray.push(i);
  }
  return (
    <PagesBox>
      {pagesArray.map((page) => {
        return (
          <Page key={page}>
            <Link href={"?p=" + page}>
              <a>{page}</a>
            </Link>
          </Page>
        );
      })}
    </PagesBox>
  );
}

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const PagesBox = styled.div`
  display: flex;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding-bottom: 20px;
`;

const Page = styled.div`
  color: white;
  background-color: #ffffff52;
  padding: 8px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 8px;
  font-weight: bold;
  margin-right: 8px;
`;

export default PagesLinks;
