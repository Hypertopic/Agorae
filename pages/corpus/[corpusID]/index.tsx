import ElementsLoader from "@components/ElementsLoader";
import Footer from "@components/Footer";
import Header from "@components/Header";
import ItemElement from "@components/ItemElement";
import Layout from "@components/Layout";
import PagesLinks from "@components/PagesLinks";
import ArgosService from "@services/Argos";
import { getAgoraeConfig } from "@services/Config";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import HyperTopic from "@services/HyperTopic";
import { setCookie,getCookie, getusernamepass } from "@services/utils";



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

  function additem(){
    let [user,pass]=getusernamepass();
    if(user==="Login"){
      alert("Please Login to add item!");
    } else{
      let agoraeConfig = getAgoraeConfig();
      let ht = new HyperTopic([agoraeConfig.argos.url],[user,pass]);
      console.log(corpusMetaData);
      ht.post(
        {
          item_name:'New item to edit',
          item_corpus:corpusMetaData.corpus_id,
          "048 organisation:":"Please add organisation",
          "045 date de début:":"date to be added",
          "image/video":"please add an image",
          "030 résumé:":"Please update this resume",
        }
      );
      location.reload();
    }
  }

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
    if (localPage && corpusID) {
      getCorpusItems(localPage);
      getCorpusMetaData(corpusID);
    }
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
    <Layout title={"Corpus : " + corpusMetaData.corpus_name}>
      <Hero>
        <h1>{corpusMetaData.corpus_name}</h1>
        <a href="#" onClick={additem}>Add item</a>
      </Hero>
      <br />
      {renderElements()}
    </Layout>
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
  a {
    background:linear-gradient(to bottom, #f5f5f5 5%, #ffffff 100%);
    background-color:#f5f5f5;
    border-radius:42px;
    border:2px solid #ffffff;
    display:inline-block;
    cursor:pointer;
    color:#0040ff;
    font-family:Arial;
    font-size:17px;
    padding:5px 31px;
    text-decoration:none;
  }
  a:hover {
    background:linear-gradient(to bottom, #ffffff 5%, #f5f5f5 100%);
    background-color:#ffffff;
  }
  a:active {
    position:relative;
    top:1px;
  }
`;
export default Corpus;
