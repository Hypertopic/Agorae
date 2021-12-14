import ElementsLoader from "@components/ElementsLoader";
import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

function Viewpoint() {
  const [readableViewpoints, setReadableViewpoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getViewpoints() {
    let Argos = new ArgosService();
    let ReadableViewpointsResult = await Argos.getAllViewpoints();

    setReadableViewpoints(ReadableViewpointsResult);
    setIsLoading(false);
  }

  useEffect(() => {
    getViewpoints();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div>
        <Header></Header>
        <Separator size={5}></Separator>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <ElementsLoader></ElementsLoader>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header title="Viewpoints"></Header>
        <Separator size={5}></Separator>
        <Layout>
          <h1>Viewpoints</h1>
          <Separator size={1}></Separator>
          {readableViewpoints.map((viewpoint) => (
            <Link key={viewpoint.viewpoint_id} href={"/viewpoint/" + viewpoint.viewpoint_id}>
              <a>
                <CorpusElement key={viewpoint["viewpoint_id"]}>{viewpoint["viewpoint_name"]}</CorpusElement>
              </a>
            </Link>
          ))}
        </Layout>
      </div>
    );
  }
}

const Layout = styled.div`
  margin-left: 50px;
  margin-right: 50px;
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
export default Viewpoint;
