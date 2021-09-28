import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'

const Home: NextPage = () => {
  return (
    <div >
      <TestComp>Agorae</TestComp>
    </div>
  )
}

const TestComp = styled.div`
text-align: center;
background-color: aliceblue;
font-size: large;
`
export default Home
