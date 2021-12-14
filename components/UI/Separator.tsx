import React from "react";
import styled from "styled-components";

interface SepProps {
  readonly size: number;
}

function Separator({ size }) {
  return <SeparatorDiv size={size}></SeparatorDiv>;
}

export default Separator;

/**
 * Styling
 * CSS with Styled Components
 * https://styled-components.com/docs
 */

const SeparatorDiv = styled.div<SepProps>`
  padding-top: ${(props) => props.size}0px;
`;
