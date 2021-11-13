import HyperTopic from "./HyperTopic";
import { getAgoraeConfig } from "./Config";

/**
  ------------------------------------------------------------------------------
    Agorae Service
  -----------------------------------------------------------------------------
**/

export default class ArgosService {
  // Init
  private agoraeConfig = getAgoraeConfig();
  private ht = new HyperTopic([this.agoraeConfig.argos.url]);

  /**
   * Corpus Methods
   * @returns
   */

  async getAllCorpusItems() {
    const data = await this.ht.getView(`/corpus/${this.agoraeConfig.argos.corpus}`);
    const corpusData = data[this.agoraeConfig.argos.corpus];

    // Create an array of elements
    const keys = Object.entries(corpusData);

    // Remove elements with array key "name" and "user" from keys array
    const filteredKeys = keys.filter((key) => key[0] !== "name" && key[0] !== "user");

    return filteredKeys;
  }

  async getCorpusItemsWithPagination(page: number, perPage: number) {
    let originalArray = this.getAllCorpusItems();
    let array = originalArray.then((data) => {
      const start = (page - 1) * perPage;
      const end = page * perPage;
      return data.slice(start, end);
    });
    let length = originalArray.then((data) => data.length);
    return { elements: array, length: length };
  }
}
