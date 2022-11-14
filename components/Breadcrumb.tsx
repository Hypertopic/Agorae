import ArgosService from "@services/Argos";
import Link from "next/link";
import Viewpoint from "pages/viewpoint";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ComponentProps {
  viewpointID?: string;
  corpusID: string | string[];
  itemName: string;
  withCorpusAndViewpoint?: boolean;
}

function Breadcrumb(props: ComponentProps) {
  const [corpusMetaData, setCorpusMetaData] = useState<any>({});
  const [viewpointMetaData, setViewpointMetaData] = useState<any>({});

  // get Corpus Name & ID
  async function getCorpusMetaData(corpusID) {
    const Argos = new ArgosService();
    const metadata = await Argos.getCorpusMetaData(corpusID);
    setCorpusMetaData(metadata);
  }

  useEffect(() => {
    if (props.corpusID) {
      getCorpusMetaData(props.corpusID);
    }
  }, [props.corpusID, props.viewpointID]);

  return (
    <BreadcrumbBox>
      <Link href={"/corpus/" + corpusMetaData.corpus_id}>
        <a href="">
          <BreadcrumbItem>{corpusMetaData.corpus_name}</BreadcrumbItem>
        </a>
      </Link>
      <div style={{padding:"7px"}}>{">"}</div>
      <Link href={"#"}>
        <a href="">
          <BreadcrumbItem>{props.itemName}</BreadcrumbItem>
        </a>
      </Link>
    </BreadcrumbBox>
  );
}

export default Breadcrumb;

const BreadcrumbBox = styled.div`
  background-color: hsl(0deg 0% 65%);
  display: flex;
  font-weight: 700;
  background: linear-gradient(176deg, rgb(205 205 205) 0%, rgba(0, 212, 255, 0) 100%);
  padding: 19px;
`;

const BreadcrumbItem = styled.div`
  padding-right: 10px;
  padding: 7px;
  border-radius: 4px;
  &:hover {
    background-color: #ffffff59;
  }
`;
