import Footer from "@components/Footer";
import Header from "@components/Header";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";

const Home: NextPage = () => {
  return (
    <div>
      <Header></Header>
      <Hero>
        <h1>Welcome to the Agorae Platform </h1>
        <p>
          Agorae-Map21 is a common mapping device for a generic co-built knowledge map about transitions. This generic scheme is adaptable to specific
          requirements of each organisation facing transition goals.
        </p>
      </Hero>
      <Footer></Footer>
    </div>
  );
};

const Hero = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  color: white;
  text-align: center;
  background-image: linear-gradient(39deg, #0393f4 0, #3f51b5);
  height: 12346px;

  h1{
    padding-top: 10px;
    margin-bottom: 0px;
    font-weight: 700;
  }
  p{
    width: 700px;
    padding-top: 10px;
    margin:auto;
    font-size: 18px;
  }
`;
export default Home;
