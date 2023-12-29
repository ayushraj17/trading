"use client";
import React from "react";
import NoSSR from "./components/NoSSR";
import dynamic from "next/dynamic";
const TradingChart = dynamic(() => import("./components/TradingChart"), {
	ssr: true,
});
const Page = () => {
	return (
		<NoSSR>
			<TradingChart />
		</NoSSR>
	);
};

export default Page;
