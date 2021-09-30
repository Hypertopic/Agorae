import HyperTopic from "../services/HyperTopic";

const Hyper = new HyperTopic(["https://steatite.utt.fr"]);

test("Check basic HyperTopic call", async () => {
  const data = await Hyper.getView("/item/Vitraux%20-%20B%C3%A9nel/85bb03f5e4930f3b9d1ef9afbfa92421b8e2e23b");
  console.log(data);
});
