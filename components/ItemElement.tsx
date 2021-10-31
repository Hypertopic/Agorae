import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function ItemElement({ title, preview, creator, description, id, creation_date }) {
  return (
    <ElementBox id={id}>
      <Preview></Preview>
      <InfoBox>
        <Title>{title}</Title>
        <Author>{creator}</Author>
        <Description>{description}</Description>
        <Date>{creation_date}</Date>
      </InfoBox>
      <Bottom>
        <Button>More Details</Button>
      </Bottom>
    </ElementBox>
  );
}

const ElementBox = styled.div``;
const Preview = styled.div``;
const InfoBox = styled.div``;
const Title = styled.div``;
const Author = styled.div``;
const Description = styled.div``;
const Date = styled.div``;
const Bottom = styled.div``;
const Button = styled.div``;
export default ItemElement;
