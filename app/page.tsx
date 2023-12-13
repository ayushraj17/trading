"use client";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	Tooltip,
	PointElement,
	LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip
);
import data from "../data";
import { useLocalStorage } from "usehooks-ts";
const PublicGoogleSheetsParser = require("public-google-sheets-parser");
const spreadSheetId = "19Obu4SoUuaTdFvVwoCFcLvl0p_DoyE4YTpg44gVQjsU";
const parser = new PublicGoogleSheetsParser(spreadSheetId);

type MarketData = {
	"Too many SOLID greens together is NOT good & vice versa Date How to read MB ": string;
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

export default function Home() {
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
		<div className="m-10">
			<select
				className="mb-6"
				value={currentTab}
				onChange={(e) => setCurrentTab(e.target.value as keyof MarketData)}
			>
				{keys.map((key) => (
					<option key={key} value={key}>
						{key}
					</option>
				))}
			</select>

			<Line
				data={{
					labels: Object.values(marketData).map(
						(i) =>
							i[
								"Too many SOLID greens together is NOT good & vice versa Date How to read MB "
							]
					),
					datasets: [
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
							// label: "Four Five",
							data: Object.values(marketData).map((i) => i[currentTab]),
						},
					],
				}}
			/>
		</div>
	);
}
