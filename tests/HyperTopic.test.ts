import { getAgoraeConfig } from "../services/Config";
import ArgosService from "../services/Argos";

// Config
const agoraeConfig = getAgoraeConfig();

// To change to ArgosService
const Agorae = new ArgosService()


test("Check for corpus items", async () => {
  const data = await Agorae.getAllCorpusItems();
  const result = data[agoraeConfig.argos.corpus];
  console.log(result);
});