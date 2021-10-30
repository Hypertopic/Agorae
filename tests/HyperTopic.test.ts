import HyperTopic from "../services/HyperTopic";
import { getAgoraeConfig } from "../services/Config";

// Config
const agoraeConfig = getAgoraeConfig();

const Hyper = new HyperTopic([agoraeConfig.argos.url]);

test("Check basic HyperTopic call", async () => {
  const data = await Hyper.getView(`/item/${agoraeConfig.argos.corpus}/85bb03f5e4930f3b9d1ef9afbfa92421b8e2e23b`);
  console.log(data);
});
