import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

function ItemElement({ title, preview, creator, description, id, creation_date }) {
  const { t, i18n } = useTranslation();
  return (
    <ElementBox id={id}>
      <Preview>
        <img src={preview ? preview : "/img/imgnotfound.png"} alt={`Picture of ` + title} />
      </Preview>
      <InfoBox>
        <Title>{title}</Title>
        <Author>{creator}</Author>
        <Description>{description}</Description>
        <Date>{creation_date}</Date>
      </InfoBox>
      <Bottom>
        <Button>
          <Link href={"/corpus/id/"+id}>
            <a>{t("item_element.more_details")}</a>
          </Link>
        </Button>
      </Bottom>
    </ElementBox>
  );
}

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const ElementBox = styled.div`
  box-shadow: 0 9px 11px 2px rgb(3 27 78 / 5%);
  width: 40px;
  background-color: white;
  border-radius: 10px;
  width: 250px;
  overflow: hidden;
  margin-right: 25px;
  margin-bottom: 60px;
`;
const Preview = styled.div`
  img {
    width: 100%;
  }
`;
const InfoBox = styled.div`
  padding: 20px;
  height: 190px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const Author = styled.div`
  padding-top: 5px;
  font-size: 16px;
  opacity: 0.5;
`;
const Description = styled.div`
  padding-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const Date = styled.div`
  padding-top: 10px;
  font-size: 12px;
  font-style: italic;
`;
const Bottom = styled.div``;
const Button = styled.div`
  padding: 15px;
  font-weight: bold;
  background-color: #000f801f;

  &:hover {
    cursor: pointer;
  }
`;
export default ItemElement;