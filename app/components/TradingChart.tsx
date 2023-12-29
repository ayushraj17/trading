"use client";
import {
	CategoryScale,
	Chart as ChartJS,
	Colors,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { getNextDays, simpleMovingAverage } from "@/utils";
import zoomPlugin from "chartjs-plugin-zoom";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Colors,
	zoomPlugin
);
const PublicGoogleSheetsParser = require("public-google-sheets-parser");
const spreadSheetId = "19Obu4SoUuaTdFvVwoCFcLvl0p_DoyE4YTpg44gVQjsU";
const parser = new PublicGoogleSheetsParser(spreadSheetId);

type MarketData = {
	"Too many SOLID greens together is NOT good & vice versa Date How to read MB ": "DD/MM/YYYY";
	"Number of Stocks up 4.5%+ Today A: Study market behaviour around extreme figures. There is a clear pattern everytime. Markets tend to stall & continue or stall & reverse the direction ": number;
	"Number of stocks down 4.5%+ Today ": number;
	"Number of stocks up 20%+ in 5 days ": number;
	"HEAT MAP Number of stocks down 20%+ in 5 days ": number;
	"Number of Stocks above 20 DMA (Early Signal) ": number;
	"Number of Stocks below 20 DMA (Early Signal) ": number;
	"Number of Stocks above 50 DMA ": number;
	"Number of Stocks below 50 DMA ": number;
};
const keys: (keyof MarketData)[] = [
	"Too many SOLID greens together is NOT good & vice versa Date How to read MB ",
	"Number of Stocks up 4.5%+ Today A: Study market behaviour around extreme figures. There is a clear pattern everytime. Markets tend to stall & continue or stall & reverse the direction ",
	"Number of stocks down 4.5%+ Today ",
	"Number of stocks up 20%+ in 5 days ",
	"HEAT MAP Number of stocks down 20%+ in 5 days ",
	"Number of Stocks above 20 DMA (Early Signal) ",
	"Number of Stocks below 20 DMA (Early Signal) ",
	"Number of Stocks above 50 DMA ",
	"Number of Stocks below 50 DMA ",
];

export default function TradingChart() {
	const [currentTab, setCurrentTab] = useState<keyof MarketData>(
		"Number of Stocks above 20 DMA (Early Signal) "
	);
	const [marketData, setMarketData] = useLocalStorage<MarketData[]>(
		"marketData",
		[]
	);

	useEffect(() => {
		parser.parse().then((items: any) => {
			setMarketData(items.reverse());
		});
	}, [setMarketData]);

	return (
		<div className="w-full max-h-screen">
			<select
				className="mb-6 w-56"
				value={currentTab}
				onChange={(e) => setCurrentTab(e.target.value as keyof MarketData)}
			>
				{keys.map((key, index) => {
					if (index === 0) return null;
					return (
						<option key={key} value={key}>
							{key.replace(
								"A: Study market behaviour around extreme figures. There is a clear pattern everytime. Markets tend to stall & continue or stall & reverse the direction",
								""
							)}
						</option>
					);
				})}
			</select>

			<Line
				width={window.innerWidth}
				height={window.innerHeight - 100}
				options={{
					plugins: {
						zoom: {
							// limits: { y: { max: 1200, min: 0 } },
							zoom: {
								wheel: {
									enabled: true,
									speed: 0.1,
								},
								pinch: {
									enabled: true,
								},
								scaleMode: "x",
								mode: "x",
								// drag: {
								// 	enabled: true,
								// 	threshold: 2,
								// },
							},
							pan: {
								enabled: true,
								// Boolean to enable panning
								// Panning directions. Remove the appropriate direction to disable
								// Eg. 'y' would only allow panning in the y direction
								// A function that is called as the user is panning and returns the
								// available directions can also be used:
								//   mode: function({ chart }) {
								//     return 'xy';
								//   },
								mode: "x",

								// Minimal pan distance required before actually applying pan
								threshold: 10,
							},
						},
					},
				}}
				data={{
					labels: [
						...Object.values(marketData).map(
							(i) =>
								i[
									"Too many SOLID greens together is NOT good & vice versa Date How to read MB "
								]
						),
						...getNextDays(
							marketData &&
								marketData.toReversed()[0] &&
								marketData.toReversed()[0][
									"Too many SOLID greens together is NOT good & vice versa Date How to read MB "
								]
						),
					],
					datasets: [
						{
							pointRadius: 0,
							borderWidth: 1,
							borderColor: "blue",
							data: [
								// ...new Array(20).fill(marketData[19][currentTab]),
								...new Array(20).fill(0),
								...simpleMovingAverage(
									Object.values(marketData).map(
										(i) => i[currentTab]
									) as number[],
									20
								),
							],
						},
						{
							backgroundColor: Object.values(marketData).map((i) => {
								if (Number(i[currentTab]) < 400) {
									return "lime";
								}
								if (Number(i[currentTab]) > 1200) {
									return "red";
								}
								return "gray";
							}),
							data: [...Object.values(marketData).map((i) => i[currentTab])],
						},
					],
				}}
			/>
		</div>
	);
}
