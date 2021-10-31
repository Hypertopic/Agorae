//-------------------------------------------------------------------------------
// Agorae V2 Config file
// ------------------------------------------------------------------------------
// Created:     30/10/2021
// Refer to Agorae Docs for more information
//-------------------------------------------------------------------------------
// Author : Sweave (Badr BENNASRI)
//-------------------------------------------------------------------------------

const configFile = {
  website: {
    title: "Agorae",
    secondary_title: "Map21 Project",
    color: "soon",
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
    url: "http://localhost:5984/argos/_design/argos/_rewrite",
    corpus: "Vitraux - Bénel",
    order: "",
  },
};

export default configFile;
