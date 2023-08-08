import React from "react";
import styled from "styled-components";

const InputValueWrapper = styled.div`
  min-height: 60px;
  min-width: 60px;
  border: 1px solid #8CBAE8;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const InputValueContent = styled.h2`
  font-weight: 500;
`;

export default function InputValue(props) {
  return (
    <InputValueWrapper
      style={
        props.status === 1
          ? { backgroundColor: "#A2FF86" }
          : props.status === 2
          ? { backgroundColor: "#F6FA70" }
          : props.status === -1
          ? { backgroundColor: "#967E76" }
          : {backgroundColor: 'transparent'}
      }
    >
      <InputValueContent>{props.textValue}</InputValueContent>
    </InputValueWrapper>
  );
}
