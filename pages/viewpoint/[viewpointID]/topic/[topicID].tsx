import ElementsLoader from "@components/ElementsLoader";
import ItemElement from "@components/ItemElement";
import Layout from "@components/Layout";
import FancyRender from "@components/UI/FancyRender";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import { getAgoraeConfig } from "@services/Config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function TopicElements() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { p, viewpointID, topicID } = router.query;
  const config = getAgoraeConfig();
  const localPage = p ? p : "1";

  const [viewpointMetaData, setViewpointMetaData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [elements, setElements] = useState<any>({});

  // Get Viewpoint Name & ID
  async function getViewpointMetaData(viewpointID) {
    const Argos = new ArgosService();
    const metadata = await Argos.getViewpointMetaData(viewpointID);
    console.log(metadata);
    setViewpointMetaData(metadata);
    setIsLoading(false);
  }

  // Get Topic Elements
  async function getTopicElements(viewpointID, topicID) {
    const Argos = new ArgosService();
    const elements = await Argos.getTopicItems(viewpointID, topicID);
    setElements(elements);
    console.log(elements);
  }

  useEffect(() => {
    if (localPage && viewpointID && topicID) {
      getViewpointMetaData(viewpointID);
      getTopicElements(viewpointID, topicID);
    }
  }, [localPage, viewpointID, topicID, isLoading]);

  // Render functions
  const renderTopics = () => {
    if (elements.topics) {
      return (
        <ListOfCorpuses>
          {elements.topics.map((topic) => (
            <Link key={topic.name} href={"/viewpoint/" + viewpointMetaData.viewpoint_id + "/topic/" + topic.id}>
              <a>
                <CorpusElement key={topic["id"]}>{topic["name"]}</CorpusElement>
              </a>
            </Link>
          ))}
        </ListOfCorpuses>
      );
    } else {
      return <div>No Topics</div>;
    }
  };

  const renderItems = () => {
    if (elements.items) {
      return (<div style={{ paddingTop: "20px"}}>
      <ElementsList>
        {elements.items.map((item) => (
          <ItemElement
            title={item.name}
            preview={ "/img/imgnotfound.png"}
            creator={"..."}
            creation_date={"..."}
            description={"..."}
            corpus_id={item.corpus}
            key={item.id}
            id={item.id}
          />
        ))}
      </ElementsList>
    </div>)
    }else {
      return <div>No Items</div>;
    }
  }

  if (isLoading) {
    return (
      <Layout title="Loading..">
        <Separator size={5}></Separator>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <ElementsLoader></ElementsLoader>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout title={viewpointMetaData.viewpoint_name + " Topics"}>
        <Separator size={5}></Separator>
        <CSSLayout>
          <h1>{viewpointMetaData.viewpoint_name} Topics : </h1>
          <Separator size={1}></Separator>
          <FancyRender>{renderTopics()}</FancyRender>
          <h1>{viewpointMetaData.viewpoint_name} Items : </h1>
          <FancyRender>{renderItems()}</FancyRender>
        </CSSLayout>
      </Layout>
    );
  }
}

export default TopicElements;

const ListOfCorpuses = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CorpusElement = styled.div`
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

const ElementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CSSLayout = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`;
