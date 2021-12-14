import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import { getAgoraeConfig } from "@services/Config";
import Link from "next/link";
import ElementsLoader from "@components/ElementsLoader";

const Corpus = () => {
  const [readableCorpuses, setReadableCorpuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getCorpuses() {
    let Argos = new ArgosService();
    let ReadableCorpusesResult = await Argos.getAllCorpuses();

    setReadableCorpuses(ReadableCorpusesResult);
    setIsLoading(false);
  }

  useEffect(() => {
    getCorpuses();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div>
        <Header></Header>
        <Separator></Separator>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <ElementsLoader></ElementsLoader>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header></Header>
        <Separator></Separator>
        <div style={{ margin: "50px" }}>
          <h1>Corpuses</h1>
          <Separator></Separator>
          <ListOfCorpuses>
            {readableCorpuses.map((corpus) => (
              <Link key={corpus.corpus_id} href={"/corpus/" + corpus.corpus_id}>
                <a>
                  <CorpusElement key={corpus["corpus_id"]}>{corpus["corpus_name"]}</CorpusElement>
                </a>
              </Link>
            ))}
          </ListOfCorpuses>
        </div>
      </div>
    );
  }
};

export default Corpus;

const config = getAgoraeConfig();
const Layout = styled.div`
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
