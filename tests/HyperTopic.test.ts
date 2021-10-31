import HyperTopic from "../services/HyperTopic";
import { getAgoraeConfig } from "../services/Config";
import AgoraeService from "../services/Agorae";

// Config
const agoraeConfig = getAgoraeConfig();

const Hyper = new HyperTopic([agoraeConfig.argos.url]);
const Agorae = new AgoraeService()


test("Check another call", async () => {
  const data = await Agorae.getAllCorpusItems();
  const result = data[agoraeConfig.argos.corpus];
  console.log(result);
});