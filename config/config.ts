//-------------------------------------------------------------------------------
// Agorae V2 Config file
// ------------------------------------------------------------------------------
// Created:     30/10/2021
// Refer to Agorae Docs for more information
//-------------------------------------------------------------------------------
// Author : Sweave (Badr B.)
//-------------------------------------------------------------------------------

const configFile = {
  website: {
    title: "Agorae",
    secondary_title: "Map21 Project",
    colors: ["#0393f4", "#3f51b5"]
  },
  seo: {
    title: "Agorae",
    description:
      "Agorae is a common mapping device for a generic co-built knowledge map about transitions. This generic scheme is adaptable to specific requirements of each organisation facing transition goals",
    keywords: "agorae, map21, collaborative, maps, collaborative maps, map, maps, map21, map21.org ",
    twitter: "@UTTroyes",
    theme_color: "#fbfdff",
  },
  argos: {
    url: "http://95.142.173.52:5984/argosmap21v4/_design/argos/_rewrite",
    available_corpuses: ["2ba774a7cbd1e14fa45e57ba0000f2ac", "2ba774a7cbd1e14fa45e57ba0000fa79", "6cc411d06b5890af3601957b5d014265", "6cc411d06b5890af3601957b5d015025"],
    home_corpus: ["2ba774a7cbd1e14fa45e57ba0000fa79"], // can be * if you want to use all available corpuses
    order: "",
  },
};

export default configFile;