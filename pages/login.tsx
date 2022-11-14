import Header from "@components/Header";
import Separator from "@components/UI/Separator";
import React from "react";
import styled from "styled-components";
import Layout from "@components/Layout";
import HyperTopic from "@services/HyperTopic";
import { getAgoraeConfig } from "@services/Config";
import { setCookie,getCookie } from "@services/utils";

function validationandlogin(){
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  if(user.length===0){
    alert("Please enter a valid username");
  } else if(pass.length===0){
    alert("Please enter a valid password");
  } else{

    let agoraeConfig = getAgoraeConfig();
    let ht = new HyperTopic([agoraeConfig.argos.url],[user,pass]);
    
    ht.authenticate().then(result=>{
      if(result.status===200){
        setCookie("agoraeUser",user,7);
        setCookie("agoraePass",pass,7);
        //redirecting
        location.replace("/");
    }else{
      alert("Sorry we could not find your account!");
    }
  });
  }
}

function Userlogin() {
  return (
    <Layout title="userlogin" desc="userlogin">
       <CSSLayout>
        <Separator size={3}></Separator>
        <h1>Login to have additional functionnalities:</h1>
        <Separator size={1}></Separator>

        <InputLabel>User :</InputLabel>
        <InputField type="text" id="user" placeholder="Username"/>
        <InputLabel>Password : </InputLabel>
        <InputField type="password" id="pass" placeholder="Password" />

        <Separator size={1}></Separator>
        <button onClick={validationandlogin}>
          Login
        </button>
      </CSSLayout>
    </Layout>
  );
}

export default Userlogin;

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const CSSLayout = styled.div`
  margin: 8% 27%;
  border-radius: 25px;
  padding-left: 40px;
  padding-bottom: 60px;
  color: #ffffff;
  background-color: #0393f4; /* For browsers that do not support gradients */
  background-image: linear-gradient(#0393f4,#3f51b5);
`;

const InputField = styled.input`
  padding: 10px;
  background-color: #e1e9ed;
  border: none;
  width: 60%;
  display: block;
  border-radius: 3px;
`;



const InputLabel = styled.h3`
  margin-bottom: 0px;
`;
