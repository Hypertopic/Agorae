import { getAgoraeConfig } from "../services/Config";
import AgoraeService from "../services/Agorae";

// Config
const agoraeConfig = getAgoraeConfig();

// To change to ArgosService
const Agorae = new AgoraeService()


test("Check for corpus items", async () => {
  const data = await Agorae.getAllCorpusItems();
  const result = data[agoraeConfig.argos.corpus];
  console.log(result);
});