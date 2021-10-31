import HyperTopic from "../services/HyperTopic";
import { getAgoraeConfig } from "../services/Config";

/**
  ------------------------------------------------------------------------------
    Agorae Service
  -----------------------------------------------------------------------------
**/

export default class AgoraeService {
  // Init
  private agoraeConfig = getAgoraeConfig();
  private ht = new HyperTopic([this.agoraeConfig.argos.url]);

  // Get all Items
  async getAllCorpusItems() {
    const data = await this.ht.getView(`/corpus/${this.agoraeConfig.argos.corpus}`);
    const corpusData = data[this.agoraeConfig.argos.corpus];

    // Create an array of elements
    const keys = Object.entries(corpusData);

    // Remove elements with array key "name" and "user" from keys array
    const filteredKeys = keys.filter((key) => key[0] !== "name" && key[0] !== "user");

    return filteredKeys;
  }
}
