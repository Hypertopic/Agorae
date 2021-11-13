import React from "react"
import ContentLoader from "react-content-loader"

const ElementsLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={1900}
    height={460}
    viewBox="0 0 900 460"
    backgroundColor="#dedede"
    foregroundColor="#fafafa"
    {...props}
  >
    <rect x="89" y="49" rx="2" ry="2" width="150" height="150" /> 
    <rect x="289" y="49" rx="2" ry="2" width="150" height="150" /> 
    <rect x="489" y="49" rx="2" ry="2" width="150" height="150" /> 
    <rect x="689" y="49" rx="2" ry="2" width="150" height="150" /> 
  </ContentLoader>
)

export default ElementsLoader

