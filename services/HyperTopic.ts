const hypertopic = require("hypertopic");

/**
  ------------------------------------------------------------------------------
    Hypertopic Service
  -----------------------------------------------------------------------------
**/
export default class HyperTopic {
  private databases: Array<string>;
  private db;
  private auth: Array<string>;

  constructor(databases: Array<string>, auth?: Array<string>) {
    this.databases = databases;
    this.db = hypertopic(this.databases);
    this.auth = auth;
  }

  getView(view) {
    const data = this.db.getView(view);
    return data;
  }

  /**
   * Utils
   */
  _log = (x) => console.log(JSON.stringify(x, null, 2));
  _error = (x) => console.error(x.message);

  /**
   * Auth-Enabled requests
   *
   */
  post(object: Object) {
    const data = this.db.auth(this.auth[0], this.auth[1])
    .post(object)
    .then(this._log)
    .catch(this._error);;
    
    return data;
  }
  delete(id){
    const data = this.db.auth(this.auth[0], this.auth[1])
    .get({_id:id})
    .then(this.db.delete)
    .then(this._log)
    .catch(this._error);
    
    return data
  }
  addAttribure(itemID){
    const data = this.db.auth(this.auth[0], this.auth[1]).get({_id:itemID})
    .then(x => Object.assign(x, {"new attribute":'Update me'}))
    .then(this.db.post)
    .then(this._log)
    .catch(this._error);

    return data;
  }
  updateAttribute(initialkey,updatedKey, updatedValue,itemID,corpusID){
    console.log(initialkey,updatedKey, updatedValue)
    let newobj={};
    newobj[updatedKey]=updatedValue;
    let parsedobj =JSON.stringify(newobj);
    this.db.auth(this.auth[0], this.auth[1]).get({_id:itemID})
    .then(x => Object.assign(x,JSON.parse(parsedobj)))
    .then(this.db.post)
    .then(this._log)
    .catch(this._error);
    if(initialkey!=updatedKey){
      setTimeout(()=>{
          this.db.auth(this.auth[0], this.auth[1]).item({_id:itemID})
          .unsetAttribute(initialkey)
          .then(this._log)
          .catch(this._error);
          location.reload();
      },1000);
    }else{
      setTimeout(()=>{
        location.reload();
    },1000);
    }
  }
  authenticate(){
    const data= fetch(this.databases[0],
      {
        method: 'HEAD',
        credentials: 'include',
        headers:{
          'Authorization': 'Basic '+Buffer.from(`${this.auth[0]}:${this.auth[1]}`).toString('base64')
        }
      });
    return data
  }

  async getattributes(corpusID){
    let response = await fetch(this.databases[0]+"/attribute/"+corpusID.toString('base64'));
    if (response.status === 200) {
        let data = await response.text();
        return data;
    }
  }
}
