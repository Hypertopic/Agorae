import HyperTopic from "../services/HyperTopic";
import { getAgoraeConfig } from "../services/Config";

// Config
const agoraeConfig = getAgoraeConfig();

const Hyper = new HyperTopic([agoraeConfig.argos.url]);

test("Check basic HyperTopic call", async () => {
  const data = await Hyper.getView(`/corpus/${agoraeConfig.argos.corpus}`);
  console.log(data[agoraeConfig.argos.corpus]);
});
