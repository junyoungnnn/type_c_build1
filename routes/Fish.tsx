import {
  Switch,
  Route,
  useLocation,
  useParams,
  Link,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchFishRealPrice, fetchFishPredictPrice } from "./api";
import Price from "./Price";
import Chart from "./Chart";
import { Helmet } from "react-helmet-async";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 680px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 204, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
  margin: 5%;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ $isactive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 153, 255, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isactive ? props.theme.accentColor2 : props.theme.accentColor};
  a {
    display: block;
  }
`;

interface RouteParams {
  fishName: string;
}

interface RouteState {
  startDate: string;
  endDate: string;
}

interface IRealPriceData {
  data: IRealData[];
}

interface IRealData {
  fishName: string;
  date: string;
  realPrice: number;
}

interface IPredictPriceData {
  data: IPredictData[];
}

interface IPredictData {
  fishName: string;
  predictDate: string;
  predictPrice: number;
}

function Fish() {
  const { fishName } = useParams<RouteParams>();
  const location = useLocation();
  const { startDate, endDate } = location.state as RouteState;
  const priceMatch = useRouteMatch("/:fishName/price");
  const chartMatch = useRouteMatch("/:fishName/chart");

  const { isLoading: realPriceLoading, data: realPriceData } =
    useQuery<IRealPriceData>(["realprice", fishName, startDate, endDate], () =>
      fetchFishRealPrice(fishName, startDate, endDate)
    );

  const { isLoading: predictPriceLoading, data: predictPriceData } =
    useQuery<IPredictPriceData>(
      ["predictprice", fishName, startDate, endDate],
      () => fetchFishPredictPrice(fishName, startDate, endDate)
    );
  const isDark = useRecoilValue(isDarkAtom);
  const loading = realPriceLoading || predictPriceLoading;
  return (
    <Container>
      <Helmet>
        <title>{fishName} 가격</title>
      </Helmet>
      <Header>
        <Title>{loading ? "Loading..." : fishName}</Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <ApexChart
            type="line"
            series={[
              {
                name: "RealPrice",
                data: realPriceData?.data?.map((price) =>
                  Number(price.realPrice)
                ) as number[],
              },
              {
                name: "PredictPrice",
                data: predictPriceData?.data?.map((price) =>
                  Number(price.predictPrice)
                ) as number[],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "dark" : "light",
              },

              chart: {
                height: 500,
                width: 700,
                zoom: {
                  enabled: false,
                },
                toolbar: {
                  show: false,
                },
                background: "transparent",
                animations: {
                  enabled: false,
                },
              },
              title: {
                text: "Week Chart",
                align: "left",
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: "#263238",
                },
              },
              stroke: {
                width: [5, 7],
                curve: "straight",
                dashArray: [0, 8],
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                  show: true,
                  style: {
                    colors: "#000000",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                  },
                },

                categories: predictPriceData?.data?.map((date) =>
                  String(date.predictDate)
                ) as String[],
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
              },
              colors: ["#0fbcf9", "#e8308b"],
              tooltip: {
                y: [
                  {
                    formatter: (value) => `${value?.toFixed(0)}원`,
                  },
                  {
                    formatter: (value) => `${value?.toFixed(0)}원`,
                  },
                ],
              },
              grid: {
                borderColor: "#ffffff",
              },
            }}
          />
          {predictPriceData?.data &&
            predictPriceData?.data.map((item, index) => (
              <div key={index}>
                <Overview>
                  <OverviewItem>
                    <span>Date</span>
                    <span>{item?.predictDate}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Real Price</span>
                    <span>{item?.predictPrice}</span>
                  </OverviewItem>
                </Overview>
              </div>
            ))}

          <Tabs>
            <Tab $isactive={chartMatch !== null}>
              <Link to={`/${fishName}/chart`}>Chart</Link>
            </Tab>
            <Tab $isactive={priceMatch !== null}>
              <Link to={`/${fishName}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:fishName/price`}>
              <Price />
            </Route>
            <Route path={`/:fishName/chart`}>
              <Chart />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Fish;
