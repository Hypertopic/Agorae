import Breadcrumb from "@components/Breadcrumb";
import ElementsLoader from "@components/ElementsLoader";
import Header from "@components/Header";
import Layout from "@components/Layout";
import FancyRender from "@components/UI/FancyRender";
import PreviewRender from "@components/UI/PreviewRender";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Comment = () => {
  const router = useRouter();
  const { corpusID, itemID } = router.query;
  const Argos = new ArgosService();
  const [ItemData, setItemData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  async function getItemData(corpusID, itemID) {
    const itemData = await Argos.getItemData(corpusID, itemID);
    
    setItemData(itemData);
    setIsLoading(false);
  }

  useEffect(() => {
    if (corpusID && itemID) {
      getItemData(corpusID, itemID);
    }
  }, [corpusID, itemID]);

  if (isLoading) {
    return (
      <ElementsList>
        <ElementsLoader></ElementsLoader>
      </ElementsList>
    );
  } else {
    return (
      <Layout title={"Item : " + ItemData.name}>
        <Separator size={5}></Separator>
        <Breadcrumb corpusID={corpusID} itemName={ItemData.name}></Breadcrumb>
        <CSSLayout>
          <h1>{ItemData.name}</h1>
          <h3>{ItemData["048 organisation:"]}</h3>
          <h4>{ItemData["045 date de début:"]}</h4>
          <Separator size={2}></Separator>
          <FancyRender>
            <Preview>
              <PreviewRender source={ItemData["image/video"]} width="560px" height="360px" alt={ItemData.name + "image"}></PreviewRender>
              <InfoBox>
                <p>
                  <b>Résumé : </b>
                  {ItemData["030 résumé:"]}{" "}
                </p>
                <br />
                <a target="_blank" rel="noreferrer" href={ItemData["plus d'info"]}>
                  Plus d'informations
                </a>
              </InfoBox>
            </Preview>
          </FancyRender>
        </CSSLayout>
      </Layout>
    );
  }
};

export default Comment;

const ListOfTopics = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TopicElement = styled.div`
  padding: 19px;
  border-radius: 9px;
  background-color: white;
  box-shadow: 0px 14px 62px rgb(0 0 0 / 10%);
  font-weight: bold;
  transition: transform 0.2s;
  margin: 20px;
  width: fit-content;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0px 14px 62px rgb(0 0 0 / 20%);
    cursor: pointer;
  }
`;

const InfoBox = styled.div`
  padding: 20px;
  width: 560px;
  p {
    line-height: 25px;
  }

  a {
    color: white;
    background-color: #074f72;
    padding: 10px;
    border-radius: 5px;
  }
`;
const CSSLayout = styled.div`
  padding-right: 14%;
  padding-left: 14%;

  h1 {
    margin-bottom: 3px;
  }

  h3 {
    color: gray;
    padding: 0%;
    margin: 0%;
  }
  h4 {
    margin-top: 3px;
    font-style: italic;
    font-size: 15px;
  }
`;

const ElementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 14%;
  padding-right: 14%;
`;

const Preview = styled.div`
  height: 100%;
  display: flex;
  img {
    border-radius: 12px;
    overflow: hidden;
  }
  box-shadow: 0px 14px 62px rgb(0 0 0 / 6%);
  overflow: hidden;
`;
