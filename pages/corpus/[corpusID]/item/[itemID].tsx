import Breadcrumb from "@components/Breadcrumb";
import Header from "@components/Header";
import Layout from "@components/Layout";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Comment = () => {
  const router = useRouter();
  const { corpusID, itemID } = router.query;
  const Argos = new ArgosService();
  const [ItemData, setItemData] = useState<any>({});

  async function getItemData(corpusID, itemID) {
    const itemData = await Argos.getItemData(corpusID, itemID);
    router.isReady ? setItemData(itemData) : " ";
  }

  useEffect(() => {
    if (corpusID && itemID) {
      getItemData(corpusID, itemID);
    }
  }, [router.isReady, corpusID, itemID]);

  return (
    <Layout title={"Item : " + ItemData.name}>
      <Separator size={5}></Separator>
      <Breadcrumb corpusID={corpusID} itemName={ItemData.name}></Breadcrumb>

      <h1>{ItemData.name}</h1>
      <img src={ItemData["image/video"]} alt="" />
    </Layout>
  );
};

export default Comment;
