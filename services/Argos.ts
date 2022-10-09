import HyperTopic from "./HyperTopic";
import { getAgoraeConfig } from "./Config";

/**
  ------------------------------------------------------------------------------
    Agorae Service
  -----------------------------------------------------------------------------
**/

export default class ArgosService {
  // Initialize the service
  private agoraeConfig = getAgoraeConfig();
  private ht = new HyperTopic([this.agoraeConfig.argos.url]);

  /**
   * Generic async foreach method
   */
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /**
   *
   * CORPUSES
   *
   * */

  /**
   * Get ALL Items from a Corpus
   */
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

  /**
   * Get Corpus Items with Pagination
   */
  async getCorpusItemsWithPagination(page: number, perPage: number, corpus) {
    let OriginalArray = await this.getAllCorpusItems(corpus);

    let AdaptedPageNumber = page - 1;
    let PaginatedArray = OriginalArray.slice(AdaptedPageNumber * perPage, (AdaptedPageNumber + 1) * perPage);
    let ArrayLength = OriginalArray.length;
    return { elements: PaginatedArray, length: ArrayLength };
  }

  /**
   * Get a single Item data
   */
  async getItemData(corpusID: string, itemID: string) {
    let data = await this.ht.getView(`/item/${corpusID}/${itemID}`);

    let itemData = await data[corpusID][itemID];

    // Add CorpusID to each element
    itemData["corpus_id"] = [corpusID];
    itemData["topicsPaths"] = [];

    for(let x in itemData.topic){
      const vp = await this.ht.getView(`/viewpoint/${itemData.topic[x].viewpoint}`);

      let pathToAdd="";
      pathToAdd+=vp[itemData.topic[x].viewpoint].name;
      pathToAdd+=" >>> ";
      pathToAdd+=vp[itemData.topic[x].viewpoint][itemData.topic[x].id]["name"][0];
      itemData["topicsPaths"].push(pathToAdd);
    }
    console.log(itemData["topicsPaths"]);
    return itemData;
  }

  /**
   * Get All Corpuses
   */
  async getAllCorpuses() {
    const availableCorpuses = this.agoraeConfig.argos.available_corpuses;
    let corpuses = [];

    await this.asyncForEach(availableCorpuses, async (corpusID) => {
      const data = await this.ht.getView(`/corpus/${corpusID}`);
      if(typeof data[corpusID] != 'undefined'){
        let corpus_name = data[corpusID].name;
        let corpus_id = corpusID;
        corpuses.push({ corpus_name, corpus_id });
      }
    });

    return corpuses;
  }

  /**
   * Get Corpus Metadata
   */
  async getCorpusMetaData(corpusID: string) {
    const data = await this.ht.getView(`/corpus/${corpusID}`);
    let corpus_name = data[corpusID].name;
    let corpus_id = corpusID;
    return { corpus_name, corpus_id };
  }

  /**
   *
   * VIEWPOINTS
   *
   * */

  /**
   * Get All Viewpoints
   */
  async getAllViewpoints() {
    const availableViewpoints = this.agoraeConfig.argos.available_viewpoints;
    let viewpoints = [];

    await this.asyncForEach(availableViewpoints, async (viewpointID) => {
      const data = await this.ht.getView(`/viewpoint/${viewpointID}`);
      if(typeof data[viewpointID] != 'undefined'){
        let viewpoint_name = data[viewpointID].name;
        let viewpoint_id = viewpointID;
        viewpoints.push({ viewpoint_name, viewpoint_id });
      }
    });

    return viewpoints;
  }

  /**
   * Get Viewpoint Metadata
   */
  async getViewpointMetaData(viewpointID: string) {
    const data = await this.ht.getView(`/viewpoint/${viewpointID}`);
    let viewpoint_name = data[viewpointID].name;
    let viewpoint_id = viewpointID;
    return { viewpoint_name, viewpoint_id };
  }

  /**
   * Get a single Viewpoint Items
   */
  async getViewpointItems(viewpointID: string) {
    const data = await this.ht.getView(`/viewpoint/${viewpointID}`);
    const viewpointData = data[viewpointID].upper;
    return viewpointData;
  }

  /**
   * Get Items & and shared topics from a Topic
   */
  async getTopicItems(topicID, viewpointID) {
    const data = await this.ht.getView(`/topic/${topicID}/${viewpointID}`);
    const topicData = data[topicID][viewpointID];
    const result = { topics: topicData.narrower, items: topicData.item };
    return result;
  }
}
