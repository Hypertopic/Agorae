import configFile from "../config/config";


/**
  ------------------------------------------------------------------------------
    Config Service
  -----------------------------------------------------------------------------
**/

export function getAgoraeConfig(): any {
  return configFile;
}
