import { useParams, Link } from "react-router-dom";
import styled, {keyframes} from "styled-components"
import { useState } from "react";



const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  height: 100vh;
  width: 100vh;
  justify-content: center;
  align-items: center;
`;

// <Box bgColor="teal" />
// <Circle bgColor="skyblue" />
// const TestBox = styled.div`
//   background-color: ${(props) => props.bgColor};
//   width: 100px;
//   height: 100px;
// `;

// // 기존 속성에 추가하는 방법
// const Circle = styled(TestBox)`
//   border-radius: 50px;
// `;

// as를 통해 style html 이름 변경
// <Btn as="a" href="/">Log in</Btn>
// const Btn = styled.button`
//   color: white;
//   background-color: tomato;
//   border: 0;
//   border-radius: 15px;
// `;

// 속성 추가하기
// const Input = styled.input.attrs({required: true, minLength: 10})`
//   background-color:tomato;
// `;

const rotationAnimation = keyframes`
  0%{
    transform:rotate(0deg);
    border-radius:0px;
  }
  50%{
    border-radius:100px;
  }
  100%{
    transform:rotate(360deg);
    border-radius:0px;
  }
`;

const Emoji = styled.span`
  font-size: 36px;
`;

const Box = styled.div`
  height: 200px;
  width: 200px;
  background-color: tomato;
  display: flex;
  justify-content: center;
  align-items: center;
  animation:${rotationAnimation} 1s linear infinite;
  ${Emoji}{
    // == span:hover{}
    &:hover{
      font-size:100px;
    }
    &:active{
      opacity: 0;
    }
  }
`;

function Home(){
    return(
    <Wrapper>
      <Link to={`/news`}>News</Link>
      <Box>
        <Emoji>?</Emoji>
      </Box>
      Helllo
      
    </Wrapper>
    );
}
export default Home;