import ArgosService from "@services/Argos";
import { getAgoraeConfig } from "@services/Config";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

function TopicElements() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { p, viewpointID, topicID } = router.query;
  const config = getAgoraeConfig();
  const localPage = p ? p : "1";

  async function getTopicElements() {
    const Argos = new ArgosService();
    const elements = await Argos.getTopicItems(viewpointID, topicID);
    console.log(elements);
  }

  getTopicElements();
  return <div></div>;
}

export default TopicElements;
