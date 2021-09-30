const hypertopic = require("hypertopic");

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
    const data = this.db.auth(this.auth[0], this.auth[1]).post(object).then(this._log).catch(this._error);
    return data;
  }
}
