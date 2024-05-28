import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { fetchFishList } from "./api";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atom";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 680px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FishsList = styled.ul``;

const Fish = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid black;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface IFishList {
  data: IData[];
}

interface IData {
  fishName: string;
  fishId: number;
}

function Fishs() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const endDate = moment().format("YYYY-MM-DD");
  const startDate = moment().subtract(7, "day").format("YYYY-MM-DD");
  const oneMonthLast = moment().subtract(1, "month").format("YYYY-MM-DD");
  return (
    <Container>
      <Helmet>
        <title>수산물 가격 예측</title>
      </Helmet>
      <Header>
        <Title>수산물 가격 예측</Title>
        <button onClick={toggleDarkAtom}>Toggle Mode</button>
      </Header>
      {fishListLoading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <FishsList>
          {fishListData?.data.map((item, index) => (
            <Fish key={index}>
              <Link
                to={{
                  pathname: `/${item.fishName}`,
                  state: {
                    fishName: item.fishName,
                    startDate: startDate,
                    endDate: endDate,
                    oneMonthLast: oneMonthLast,
                  },
                }}
              >
                {item.fishName} &rarr;
              </Link>
            </Fish>
          ))}
        </FishsList>
      )}
    </Container>
  );
}
export default Fishs;
