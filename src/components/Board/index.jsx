import React from "react";
import InputValue from "../InputValue";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  gap: 10px;
`;

export default function Board(props) {
  const renderBoard = () => {
    return props.dataTable.map((data, index) => {
      return (
        <Row key={index}>
          {data.map((item, index) => {
            return <InputValue key={index} textValue={item.value} status={item.status}></InputValue>;
          })}
        </Row>
      );
    });
  };
  return <div>{renderBoard()}</div>;
}
