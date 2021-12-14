import ElementsLoader from "@components/ElementsLoader";
import Footer from "@components/Footer";
import Header from "@components/Header";
import ItemElement from "@components/ItemElement";
import PagesLinks from "@components/PagesLinks";
import ArgosService from "@services/Argos";
import { getAgoraeConfig } from "@services/Config";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function Corpus() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { p, corpusID } = router.query;
  const config = getAgoraeConfig();

  const localPage = p ? p : "1";

  // React State
  const [elements, setElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesNumber, setPagesNumber] = useState(0);
  const [corpusMetaData, setCorpusMetaData] = useState<any>({});

  // Get
  async function getCorpusItems(page) {
    const Argos = new ArgosService();

    const data = await Argos.getCorpusItemsWithPagination(page, 8, [corpusID]);
    const elements = await data.elements;
    const length = await data.length;

    // Calculate page nbr
    let pagesNbr = Math.ceil(length / 8);

    // Set states
    setElements(elements);
    setIsLoading(false);
    setPagesNumber(pagesNbr);
  }

  async function getCorpusMetaData(corpusID) {
    const Argos = new ArgosService();
    const metadata = await Argos.getCorpusMetaData(corpusID);
    setCorpusMetaData(metadata);
  }

  useEffect(() => {
    getCorpusItems(localPage);
    getCorpusMetaData(corpusID);
  }, [localPage, corpusID]);

  function renderElements() {
    if (isLoading) {
      return (
        <ElementsList>
          <ElementsLoader></ElementsLoader>
        </ElementsList>
      );
    } else {
      return (
        <AnimatePresence>
          <div style={{ top: "-120px", position: "relative" }}>
            <PagesLinks withCorpusID={corpusID} withViewpointID={false} pagesCount={pagesNumber}></PagesLinks>
            <ElementsList>
              {elements.map((item) => (
                <ItemElement
                  title={item["1"].name}
                  preview={item["1"]["image/video"] ? item["1"]["image/video"] : "/img/imgnotfound.png"}
                  creator={item["1"]["048 organisation:"]}
                  creation_date={item["1"]["045 date de début:"]}
                  description={item["1"]["030 résumé:"]}
                  corpus_id={item["1"].corpus_id}
                  key={item["1"].key}
                  id={item[0]}
                />
              ))}
            </ElementsList>
          </div>
        </AnimatePresence>
      );
    }
  }
  return (
    <div>
      <Header title={corpusMetaData.corpus_name} desc={corpusMetaData.corpus_name}></Header>
      <Hero>
        <h1>{corpusMetaData.corpus_name}</h1>
      </Hero>
      {renderElements()}
      <Footer></Footer>
    </div>
  );
}

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const config = getAgoraeConfig();
const ElementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 14%;
  padding-right: 14%;
`;

const Hero = styled.div`
  margin-top: 25px;
  padding-top: 30px;
  color: white;
  text-align: center;
  background-image: linear-gradient(39deg, ${config.website.colors[0]}, ${config.website.colors[1]});
  height: 250px;

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
export default Corpus;
