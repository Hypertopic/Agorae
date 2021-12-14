import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Comment = () => {
  const router = useRouter();
  const { corpusID, itemID } = router.query;
  const Argos = new ArgosService();
  const [ItemData, setItemData] = useState<any>({});

  // http://localhost:3000/corpus/2ba774a7cbd1e14fa45e57ba0000fa79/item/6cc411d06b5890af3601957b5d0024e4

  async function getItemData(corpusID, itemID) {
    const itemData = await Argos.getItemData(corpusID, itemID);
    router.isReady ? setItemData(itemData) : " ";
  }

  useEffect(() => {
    getItemData(corpusID, itemID);
  }, [router.isReady]);

  return (
    <>
      <Header></Header>
      <Separator size={5}></Separator>
      <h3>{corpusID} {">"} {itemID}</h3>
      <h1>{ItemData.name}</h1>
      <img src={ItemData["image/video"]} alt="" />
    </>
  );
};

export default Comment;
