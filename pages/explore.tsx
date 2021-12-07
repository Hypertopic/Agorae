import Footer from "@components/Footer";
import Header from "@components/Header";
import React, { useEffect, useState } from "react";
import { getAgoraeConfig } from "../services/Config";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ArgosService from "@services/Argos";
import { useRouter } from "next/router";
import ElementsLoader from "@components/ElementsLoader";
import PagesLinks from "@components/PagesLinks";
import ItemElement from "@components/ItemElement";

const Explore = () => {
  const config = getAgoraeConfig();
  const corpuses = config.argos.available_corpuses;
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { p } = router.query;

  const localPage = p ? p : "1";

  // React State
  const [elements, setElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [localCorpus, setLocalCorpus] = useState(config.argos.home_corpus);

  // Get
  async function getCorpusItems(page, corpus) {
    const Argos = new ArgosService();
    const data = await Argos.getCorpusItemsWithPagination(page, 8, corpus);
    const elements = await data.elements;
    const length = await data.length;

    // Calculate page nbr
    let pagesNbr = Math.ceil(length / 8);
    

    // Set states
    setElements(elements);
    setIsLoading(false);
    setPagesNumber(pagesNbr);
  }

  useEffect(() => {
    getCorpusItems(localPage, localCorpus);
  }, [localPage, localCorpus]);

  function changeResults(value) {
    setLocalCorpus(value);
    getCorpusItems(localPage,value)
  }

  function renderElements() {
    if (isLoading) {
      return (
        <ElementsList>
          <ElementsLoader></ElementsLoader>
        </ElementsList>
      );
    } else {
      return (
        <div style={{ top: "-120px", position: "relative" }}>
          <PagesLinks pagesCount={pagesNumber}></PagesLinks>
          <ElementsList>
            {elements.map((item) => (
              <ItemElement
                title={item["1"].name}
                preview={item["1"].thumbnail}
                creator={item["1"].creator}
                creation_date={item["1"].creation_date}
                description={item["1"].description}
                key={item["1"].key}
                id={item["O"]}
              />
            ))}
          </ElementsList>
        </div>
      );
    }
  }

  return (
    <div>
      <Header title="Home" desc="Homepage "></Header>
      <Hero>
        <h1>Trouver des Elements par corpus </h1>
        <br />
        <select onChange={(e) => changeResults([e.target.value])} name="cars" id="cars">
          {corpuses.map((corpus) => {
            return (
              <option key={corpus} value={corpus}>
                {corpus}
              </option>
            );
          })}
        </select>
      </Hero>
      {renderElements()}
      <Footer></Footer>
    </div>
  );
};

export default Explore;

const Hero = styled.div`
  margin-top: 25px;
  padding-top: 30px;
  color: white;
  text-align: center;
  background-image: linear-gradient(39deg, #0393f4 0, #3f51b5);
  height: 320px;

  h1 {
    padding-top: 10px;
    margin-bottom: 0px;
    font-weight: 700;
  }
  p {
    width: 700px;
    padding-top: 10px;
    margin: auto;
    font-size: 18px;
  }
`;

const ElementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 14%;
  padding-right: 14%;
`;
