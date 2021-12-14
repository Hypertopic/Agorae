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

  async getAllCorpusItemsOld() {
    const data = await this.ht.getView(`/corpus/${this.agoraeConfig.argos.corpus}`);
    const corpusData = data[this.agoraeConfig.argos.corpus];

    // Create an array of elements
    const keys = Object.entries(corpusData);

    // Remove elements with array key "name" and "user" from keys array
    const filteredKeys = keys.filter((key) => key[0] !== "name" && key[0] !== "user");

    return filteredKeys;
  }

  /**
   * Generic async foreach method
   * @param array
   * @param callback
   */
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async getAllCorpusItems(corpus) {
    let corpuses = [];
    let result = [];

    if (corpus === "*") {
      corpuses = this.agoraeConfig.argos.available_corpuses;
    } else {
      corpuses = corpus;
    }

    await this.asyncForEach(corpuses, async (corpus) => {
      const data = await this.ht.getView(`/corpus/${corpus}`);
      const corpusData = data[corpus];

      // Create an array of elements
      const keys = Object.entries(corpusData);

      // Remove elements with array key "name" and "user" from keys array
      const filteredKeys = keys.filter((key) => key[0] !== "name" && key[0] !== "user");

      // Add CorpusID to each element
      filteredKeys.forEach((element) => {
        element[1]["corpus_id"] = [corpus];
      });

      result = result.concat(filteredKeys);
    });

    return result;
  }

  async getCorpusItemsWithPagination(page: number, perPage: number, corpus) {
    let OriginalArray = await this.getAllCorpusItems(corpus);
    let AdaptedPageNumber = page - 1;
    let PaginatedArray = OriginalArray.slice(AdaptedPageNumber * perPage, (AdaptedPageNumber + 1) * perPage);
    let ArrayLength = OriginalArray.length;
    console.log(PaginatedArray);
    return { elements: PaginatedArray, length: ArrayLength };
  }

  /**
   * Item Method
   * @returns
   */

  async getItemData(corpusID, itemID) {
    const data = await this.ht.getView(`/item/${corpusID}/${itemID}`);

    const itemData = data[corpusID][itemID];
    // Add CorpusID to each element
    itemData["corpus_id"] = [corpusID];

    return itemData;
  }

  /**
   * Get All Corpuses
   *
   */
  async getAllCorpuses() {
    const availableCorpuses = this.agoraeConfig.argos.available_corpuses;
    let corpuses = [];

    await this.asyncForEach(availableCorpuses, async (corpusID) => {
      const data = await this.ht.getView(`/corpus/${corpusID}`);

      let corpus_name = data[corpusID].name;
      let corpus_id = corpusID;
      corpuses.push({ corpus_name, corpus_id });
    });
    
    return corpuses;
  }
}
