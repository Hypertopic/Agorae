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
    private ht = new HyperTopic([this.agoraeConfig.argos.url]);;
    
    // Get all Items
    async getAllCorpusItems() {
        const data = await this.ht.getView(`/corpus/${this.agoraeConfig.argos.corpus}`);
        const ItemsCount = data[this.agoraeConfig.argos.corpus].length;
        return data;
    }

}