import Footer from "@components/Footer";
import Header from "@components/Header";
import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const Home: NextPage = () => {
  const t = useTranslations("homepage");
  return (
    <div>
      <Header></Header>
      <Hero>
        <h1>{t("title", { name: "Agorae" })} </h1>
        <p>{t("description", { name: "Agorae" })}</p>
      </Hero>
      <Footer></Footer>
    </div>
  );
};

// languages
export function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like, but the recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      messages: require(`../lang/locales/${locale}.json`),
    },
  };
}

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
