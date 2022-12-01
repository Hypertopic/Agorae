import Breadcrumb from "@components/Breadcrumb";
import ElementsLoader from "@components/ElementsLoader";
import Header from "@components/Header";
import Layout from "@components/Layout";
import FancyRender from "@components/UI/FancyRender";
import PreviewRender from "@components/UI/PreviewRender";
import Separator from "@components/UI/Separator";
import ArgosService from "@services/Argos";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getAgoraeConfig } from "@services/Config";
import HyperTopic from "@services/HyperTopic";
import { setCookie,getCookie, getusernamepass } from "@services/utils";
import { elementDragControls } from "framer-motion/types/gestures/drag/VisualElementDragControls";

const Comment = () => {
  const router = useRouter();
  const { corpusID, itemID } = router.query;
  const Argos = new ArgosService();
  const [ItemData, setItemData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  async function getItemData(corpusID, itemID) {
    const itemData = await Argos.getItemData(corpusID, itemID);
    setItemData(itemData);
    setIsLoading(false);
  }
  function addAttribute(){
    let [user,pass]=getusernamepass();
    if(user==="Login"){
      alert("Please Login to add item!");
    } else{
      let agoraeConfig = getAgoraeConfig();
      let ht = new HyperTopic([agoraeConfig.argos.url],[user,pass]);
      ht.addAttribure(itemID);
      location.reload();
      }
  }
  function updateattributes(){
    let [user,pass]=getusernamepass();
    if(user==="Login"){
      alert("Please Login to update the attribute!");
    } else{
      let agoraeConfig = getAgoraeConfig();
      let ht = new HyperTopic([agoraeConfig.argos.url],[user,pass]);
      for(let i in ItemData){
        if(i!="topic" && i!="topicsPaths"){
          try{
            let updatedKey = document.getElementById(i).textContent;
            let updatedValue = document.getElementById(i+"_value").textContent;
            
            if(i!=updatedKey || ItemData[i]!=updatedValue){
              let initialkey = i;
              ht.updateAttribute(initialkey,updatedKey, updatedValue,itemID,corpusID);
            }
          }catch(error){
            console.log(error);
          }
        }
      }
      }
  }
  function autocomplete(idelement){
    let element= document.getElementById(idelement);
    let textfilter= element.textContent;
    let dropdown = document.getElementById("dd_"+idelement);
    let [user,pass]=getusernamepass();
    let agoraeConfig = getAgoraeConfig();
    let ht = new HyperTopic([agoraeConfig.argos.url],[user,pass]);
    ht.getattributes(corpusID).then(data=>{
      data=JSON.parse(data);
      let autocompletelist=data["rows"];
      dropdown.innerHTML = "";
      autocompletelist=autocompletelist.forEach(att => {
        
        let autocompletion=att["key"][1];
        
        if(autocompletion.includes(textfilter)){
          let a = document.createElement('a');
          a.innerHTML = autocompletion;
          a.addEventListener("click",()=>{
            element.innerText=autocompletion;
          });
          dropdown.append(a);
        }
      });
    })
    dropdown.style.display = "block";
  }
  function addtopic(){

  }
  useEffect(() => {
    if (corpusID && itemID) {
      getItemData(corpusID, itemID);
    }
  }, [corpusID, itemID]);

  if (isLoading) {
    return (
      <ElementsList>
        <ElementsLoader></ElementsLoader>
      </ElementsList>
    );
  } else {
    document.addEventListener('keypress', (event)=>{
      if(event.code === "Enter") {
        event.preventDefault();
        updateattributes();
      }  
    });
    document.addEventListener("click", function() {
      for(let i in ItemData){
        if(i!="topic" && i!="topicsPaths"){
          try{
            document.getElementById("dd_"+i).style.display = "none";
            document.getElementById("dd_"+i+"_value").style.display = "none";
          }catch(e){
            console.log(e);
          }
        }
      }
    });
    return (
      <Layout title={"Item : " + ItemData.name}>
        <Separator size={5}></Separator>
        <Breadcrumb corpusID={corpusID} itemName={ItemData.name}></Breadcrumb>
        <CSSLayout>
          <h1>{ItemData.name}</h1>
          <h3>{ItemData["048 organisation:"]}</h3>
          <h4>{ItemData["045 date de début:"]}</h4>
          <Separator size={2}></Separator>
          <FancyRender>
            <Preview>
              <PreviewRender source={ItemData["image/video"] || "No image"} width="560px" height="360px" alt={ItemData.name + "image"}></PreviewRender>
              <InfoBox>
                <p>
                  <b>Résumé : </b>
                  {ItemData["030 résumé:"]}{" "}
                </p>
                <br />
                <br />
              </InfoBox>
            </Preview>
            <br />
            <h2>Attributs:</h2>
            {Object.entries(ItemData).map(([key, value]) => (
              (key!="topic" && key!="topicsPaths") ?
              <div>
                <Key id={key} onInput={()=>{autocomplete(key)}} contentEditable="true">{key}</Key>
                <Dropdowncontent id={"dd_"+key}>
                </Dropdowncontent>
                <Value id={key + "_value"} onInput={()=>{autocomplete(key+"_value")}} contentEditable="true">{value}</Value>
                <Dropdowncontent id={"dd_"+key+"_value"}>
                </Dropdowncontent>
                <br />
              </div>
              : ""
            ))}
            <br />
            <Button onClick={addAttribute}>Add attribute</Button>
            <h2>Topics:</h2>
            {(Object.entries(ItemData["topicsPaths"])).map((path) => (
              <p>{path.slice(1)}</p>
            ))}
            <Button onClick={addtopic}>Add Topic</Button>

            <br />
          </FancyRender>
        </CSSLayout>
      </Layout>
    );
  }
};

export default Comment;

const ListOfTopics = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TopicElement = styled.div`
  padding: 19px;
  border-radius: 9px;
  background-color: white;
  box-shadow: 0px 14px 62px rgb(0 0 0 / 10%);
  font-weight: bold;
  transition: transform 0.2s;
  margin: 20px;
  width: fit-content;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0px 14px 62px rgb(0 0 0 / 20%);
    cursor: pointer;
  }
`;

const InfoBox = styled.div`
  padding: 20px;
  width: 560px;
  p {
    line-height: 25px;
  }

  a {
    color: white;
    background-color: #074f72;
    padding: 10px;
    border-radius: 5px;
  }
`;
const CSSLayout = styled.div`
  padding-right: 14%;
  padding-left: 14%;

  h1 {
    margin-bottom: 3px;
  }

  h3 {
    color: gray;
    padding: 0%;
    margin: 0%;
  }
  h4 {
    margin-top: 3px;
    font-style: italic;
    font-size: 15px;
  }
`;
const Button = styled.div`
  padding: 15px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  background:linear-gradient(to bottom, #0393f4 5%, #3f51b5 100%);
  &:hover {
    cursor: pointer;
  }
`;
const Key = styled.div`
  padding: 20px;
  font-weight: bold;
  color: #ffffff;
  background-color: #074f72;
  text-align: center;
  border-radius: 50px 50px 0px 0px;
  &:hover {
    cursor: pointer;
  }
`;
const Value = styled.div`
  padding: 7px;
  color: #ffffff;
  text-align: center;
  background:linear-gradient(to bottom, #0393f4 5%, #3f51b5 100%);
  margin-bottom: 15px;
  border-radius: 0px 0px 50px 50px;
  &:hover {
    cursor: pointer;
  }
`;
const Dropdowncontent = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    &:hover {
      background-color: #ddd;
      cursor: pointer;
    }
  }
`
const ElementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 14%;
  padding-right: 14%;
`;

const Preview = styled.div`
  height: 100%;
  display: flex;
  img {
    border-radius: 12px;
    overflow: hidden;
  }
  box-shadow: 0px 14px 62px rgb(0 0 0 / 6%);
  overflow: hidden;
`;
