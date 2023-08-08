import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import styled from "styled-components";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import { DATA_KEYBOARD, DATA_TABLE, WORD_LIST } from "../data/data";

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
  const [appearedLetters, setAppearedLetters] = useState(Array(6).fill([]));
  const [rowIndex, setRowIndex] = useState(0);
  const [keyWord, setKeyWord] = useState(
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  );

  const resetGame = () => {
    setKeyBoardActive("");
    setDataKeyboard(rawArrKeyboard());
    setArrTable(rawArrTable());
    setNumberLetterCorrect([]);
    setValueOnRow([]);
    setRowIndex(0);
    setKeyWord(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  };

  const createPlayAgainConfirm = (message) => {
    alert(message);
    resetGame();
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
      const key_word = keyWord.split("");
      let tmpArr = [...arrTable];
      let tmpKeyboard = [...dataKeyboard];
      let tmpNumberLetterCorrect = [];
      for (let i = 0; i < valueOnRow.length; i++) {
        if (key_word.includes(tmpArr[rowIndex][i].value)) {
          if (tmpArr[rowIndex][i].value === key_word[i]) {
            tmpArr[rowIndex][i].status = 1;
            const keyObj = tmpKeyboard
              .flat()
              .find((item) => item.value === tmpArr[rowIndex][i].value);
            if (keyObj) {
              keyObj.status = 1;
            }
            // if (!tmpNumberLetterCorrect.includes(tmpArr[rowIndex][i].value)) {
              tmpNumberLetterCorrect.push(tmpArr[rowIndex][i].value);
            // }
          } else {
            tmpArr[rowIndex][i].status = 2;
            const keyObj = tmpKeyboard
              .flat()
              .find((item) => item.value === arrTable[rowIndex][i].value);
            if (keyObj && keyObj.status === 0) {
              keyObj.status = 2;
            }
          }
        } else {
          tmpArr[rowIndex][i].status = -1;
          const keyObj = tmpKeyboard
            .flat()
            .find((item) => item.value === arrTable[rowIndex][i].value);
          if (keyObj) {
            keyObj.status = -1;
          }
        }
      }

      setAppearedLetters((prevAppearedLetters) => {
        const newRow = [...prevAppearedLetters[rowIndex]];

        for (let i = 0; i < valueOnRow.length; i++) {
          if (!newRow.includes(tmpArr[rowIndex][i].value)) {
            newRow.push(tmpArr[rowIndex][i].value);
          }
        }

        const newAppearedLetters = [...prevAppearedLetters];
        newAppearedLetters[rowIndex] = newRow;

        return newAppearedLetters;
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
        setTimeout(() => {
          createPlayAgainConfirm("Đoán đúng rồi");
        }, 100);
      } else if (isWin && rowIndex === 6) {
        setTimeout(() => {
          createPlayAgainConfirm("Đoán đúng rồi");
        }, 100);
      } else if (isLose) {
        setTimeout(() => {
          createPlayAgainConfirm("Thua rồi");
        }, 100);
      }
    };

    handleStateChanges();
  }, [numberLetterCorrect, rowIndex]);

  useEffect(() => {
    handleFillRow();
  }, [valueOnRow]);
  console.log(numberLetterCorrect);
  return (
    <MainWrapper>
      <Title />
      <div>{keyWord}</div>
      <Board dataTable={arrTable} />
      <Keyboard dataKeyboard={dataKeyboard} handleClickButton={handleClick} />
    </MainWrapper>
  );
};

export default Main;
