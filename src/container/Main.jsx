import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import styled from "styled-components";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import { DATA_KEYBOARD, DATA_TABLE, WORD_LIST } from "../data/data";
import { Alert, AlertTitle } from "@mui/material";

const MainWrapper = styled.div`
  padding: 20px 200px;
`;

const rawArrTable = () => {
  return DATA_TABLE.map((row) => {
    return row.map((char) => ({ ...char }));
  });
};

const rawArrKeyboard = () => {
  return DATA_KEYBOARD.map((row) => {
    return row.map((item) => ({ ...item }));
  });
};

const Main = () => {
  const [keyBoardActive, setKeyBoardActive] = useState("");
  const [dataKeyboard, setDataKeyboard] = useState(rawArrKeyboard());
  const [arrTable, setArrTable] = useState(rawArrTable());
  const [valueOnRow, setValueOnRow] = useState([]);
  const [numberLetterCorrect, setNumberLetterCorrect] = useState([]);
  // const [appearedLetters, setAppearedLetters] = useState(Array(6).fill([]));
  const [rowIndex, setRowIndex] = useState(0);
  const [answer, setAnswer] = useState(
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  );
  const [alertData, setAlertData] = useState(null);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);

  const resetGame = () => {
    setKeyBoardActive("");
    setDataKeyboard(rawArrKeyboard());
    setArrTable(rawArrTable());
    setNumberLetterCorrect([]);
    setValueOnRow([]);
    setRowIndex(0);
    setAnswer(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  };

  const createPlayAgainConfirm = (message, status) => {
    setKeyboardEnabled(false);
    setAlertData(
      <Alert severity={status}>
        <AlertTitle>{status.toUpperCase()}</AlertTitle>
        {message}
      </Alert>
    );
    setTimeout(() => {
      setAlertData(null);
      setKeyboardEnabled(true);
      resetGame();
    }, 2000);
  };

  const handleFillRow = () => {
    if (rowIndex <= 5) {
      setArrTable((prevArrTable) => {
        const updateArrTable = [...prevArrTable];
        const maxIndex = valueOnRow.length - 1;

        updateArrTable[rowIndex].splice(maxIndex, 1, {
          value: valueOnRow[maxIndex],
          status: 0,
        });
        return updateArrTable;
      });
    }
  };

  const handleRemoveValueOnRow = () => {
    const maxIndexInRow = valueOnRow.length - 1;
    setValueOnRow((prevValueOnRow) => {
      const newValueOnRow = [...prevValueOnRow];
      newValueOnRow.pop();
      return newValueOnRow;
    });

    arrTable[rowIndex].splice(maxIndexInRow, 1, "");
    setArrTable(arrTable);
  };

  const handleCheckWord = () => {
    const rightWord = WORD_LIST.some((word) => word === valueOnRow.join(""));
    if (rightWord) {
      const keyWord = answer.split("");
      const tmpArr = [...arrTable];
      const tmpKeyboard = [...dataKeyboard];
      const tmpNumberLetterCorrect = [];

      // create array to determine status of letter
      const colors = valueOnRow.map((letter, index) => {
        if (letter === keyWord[index]) {
          tmpNumberLetterCorrect.push(letter);
          return "correct";
        } else if (
          keyWord.includes(letter) &&
          !tmpNumberLetterCorrect.includes(letter)
        ) {
          const targetIndex = keyWord.indexOf(letter);
          keyWord[targetIndex] = "notEntirelyCorrect";
          return "notEntirelyCorrect";
        } else {
          return "incorrect";
        }
      });

      // update state for keyboard
      tmpArr[rowIndex].forEach((item, i) => {
        if (colors[i] === "correct") {
          item.status = 1;
        } else if (colors[i] === "notEntirelyCorrect") {
          item.status = 2;
        } else {
          item.status = -1;
        }

        const keyObj = tmpKeyboard
          .flat()
          .find((item) => item.value === tmpArr[rowIndex][i].value);
        if (keyObj) {
          if (item.status === 1) {
            keyObj.status = 1;
          } else if (item.status === 2 && keyObj.status === 0) {
            keyObj.status = 2;
          } else if (item.status === -1 && keyObj.status === 0) {
            keyObj.status = -1;
          }
        }
      });

      setRowIndex((prevRowIndex) => prevRowIndex + 1);
      setValueOnRow([]);
      setArrTable(tmpArr);
      setDataKeyboard(tmpKeyboard);
      setNumberLetterCorrect(tmpNumberLetterCorrect);
    } else {
      alert("Vui lòng chọn từ có nghĩa");
    }
  };

  const handleClick = (i) => {
    if (!keyboardEnabled) return;
    switch (i) {
      case "ENTER":
        if (rowIndex <= 5) {
          if (valueOnRow.length === 5) {
            handleCheckWord();
          } else {
            alert("Chưa đủ ký tự");
          }
        }
        break;
      case "DEL":
        handleRemoveValueOnRow();
        break;
      default:
        if (i !== "ENTER" && i !== "DEL") {
          setKeyBoardActive(i);
          setValueOnRow((prevValueOnRow) => {
            const newValueOnRow =
              prevValueOnRow.length < 5
                ? [...prevValueOnRow, i]
                : prevValueOnRow;
            return newValueOnRow;
          });
          handleFillRow();
        }
        break;
    }
  };

  useEffect(() => {
    const handleStateChanges = () => {
      const isWin = numberLetterCorrect.length === 5;
      const isLose = rowIndex > 5;
      if (isWin) {
        createPlayAgainConfirm("Đoán đúng rồi", "success");
      } else if (isWin && rowIndex === 6) {
        createPlayAgainConfirm("Đoán đúng rồi", "success");
      } else if (isLose) {
        createPlayAgainConfirm("Thua rồi", "info");
      }
    };

    handleStateChanges();
  }, [numberLetterCorrect, rowIndex]);

  useEffect(() => {
    handleFillRow();
  }, [valueOnRow]);
  return (
    <MainWrapper>
      <Title />
      {alertData}
      <div>{answer}</div>
      <Board dataTable={arrTable} />
      <Keyboard dataKeyboard={dataKeyboard} handleClickButton={handleClick} />
    </MainWrapper>
  );
};

export default Main;
