import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import styled from "styled-components";
import React from "react";
import { getAgoraeConfig } from "@services/Config";

function Corpus() {
  const config = getAgoraeConfig();
  const corpuses = config.argos.available_corpuses;
  return (
    <div>
      <Header title="Corpuses"></Header>
      <Separator></Separator>
      <Layout>
        <h1>Corpuses</h1>
        <Separator></Separator>
        <ListOfCorpuses>
          {corpuses.map((element) => {
            return <CorpusElement key={element}>{element}</CorpusElement>;
          })}
        </ListOfCorpuses>
      </Layout>
    </div>
  );
}

export default Corpus;

const Layout = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`;

const ListOfCorpuses = styled.div`
  display: flex;
`;
const CorpusElement = styled.div`
  padding: 30px;
  border-radius: 10px;
  background-color: #4a8ac2;
  color: white;
  margin-right: 16px;
`;
