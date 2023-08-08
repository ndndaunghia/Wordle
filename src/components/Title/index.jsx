import React from "react";
import styled from "styled-components";

const TitleWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TitleContent = styled.h2`
  
`;

export default function Title() {
  return (
    <TitleWrapper>
        <TitleContent>Wordle</TitleContent>
    </TitleWrapper>
  );
}
