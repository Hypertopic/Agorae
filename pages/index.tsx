import Footer from "@components/Footer";
import Header from "@components/Header";
import type { GetStaticPropsContext, NextPage } from "next";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Home: NextPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Header title="Home" desc="Homepage "></Header>
      <Hero>
        <h1>{t("homepage.title", { name: "Agorae" })} </h1>
        <p>{t("homepage.description", { name: "Agorae" })}</p>
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
  height: 300px;

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
export default Home;
