import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

const KeyboardWrapper = styled.div`
  /* You can add your styles for the container here */
`;

const KeyboardItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 0;
  gap: 2px;
`;

const CustomButton = styled(Button)`
  min-height: 40px;
  min-width: 40px;
  color: '#000';
`;

export default function Keyboard(props) {
  return (
    <KeyboardWrapper>
      {props.dataKeyboard.map((data, index) => {
        return (
          <KeyboardItem key={index}>
            {data.map((item, index) => {
              return (
                <CustomButton
                  style={{
                    backgroundColor:
                      item.status === 1
                        ? "#A2FF86"
                        : item.status === 2
                        ? "#F6FA70"
                        : item.status === -1
                        ? "#967E76"
                        : "transparent",
                    color: '#000'
                        
                  }}
                  key={index}
                  variant="outlined"
                  onClick={() => props.handleClickButton(item.value)}
                >
                  {item.value}
                </CustomButton>
              );
            })}
          </KeyboardItem>
        );
      })}
    </KeyboardWrapper>
  );
}
