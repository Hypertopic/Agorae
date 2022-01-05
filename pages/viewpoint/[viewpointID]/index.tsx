import ElementsLoader from "@components/ElementsLoader";
import Header from "@components/Header";
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

function Viewpoint() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { p, viewpointID } = router.query;
  const config = getAgoraeConfig();
  const localPage = p ? p : "1";

  // React States
  const [items, setItems] = useState([]);
  const [viewpointMetaData, setViewpointMetaData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get Viewpoint Name & ID
  async function getViewpointMetaData(viewpointID) {
    const Argos = new ArgosService();
    const metadata = await Argos.getViewpointMetaData(viewpointID);
    setViewpointMetaData(metadata);
  }

  // Get Viewpoint Items (actual viewpoints)
  async function getViewpointItems(viewpointID) {
    const Argos = new ArgosService();
    const elements = await Argos.getViewpointItems(viewpointID);
    setIsLoading(false);
    setItems(elements);
  }

  useEffect(() => {
    if (localPage && viewpointID) {
      getViewpointMetaData(viewpointID);
      getViewpointItems(viewpointID);
    }
  }, [localPage, viewpointID, isLoading]);

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
          <FancyRender>
            <ListOfCorpuses>
              {items.map((topic) => (
                <Link key={topic.name} href={"/viewpoint/" + viewpointMetaData.viewpoint_id + "/topic/" + topic.id}>
                  <a>
                    <CorpusElement key={topic["id"]}>{topic["name"]}</CorpusElement>
                  </a>
                </Link>
              ))}
            </ListOfCorpuses>
          </FancyRender>
        </CSSLayout>
      </Layout>
    );
  }
}

export default Viewpoint;

const CSSLayout = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`;

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
