import Breadcrumb from "@components/Breadcrumb";
import ElementsLoader from "@components/ElementsLoader";
import Header from "@components/Header";
import Layout from "@components/Layout";
import FancyRender from "@components/UI/FancyRender";
import PreviewRender from "@components/UI/PreviewRender";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
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
          <Separator size={2}></Separator>
          <FancyRender>
            <Preview>
              <PreviewRender source={ItemData["image/video"]} width="560px" height="360px" alt={"image"}></PreviewRender>
            </Preview>
          </FancyRender>
        </CSSLayout>
      </Layout>
    );
  }
};

export default Comment;

const CSSLayout = styled.div`
  padding-right: 14%;
  padding-left: 14%;
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
  img {
    border-radius: 12px;
    overflow: hidden;
    height: 360px;
    width: 560px;
  }
  box-shadow: 0px 14px 62px rgb(0 0 0 / 6%);
  overflow: hidden;
`;
