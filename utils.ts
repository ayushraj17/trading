/**
 * Calculate the simple moving average from stock prices.
 * @param {Array} prices - The list of prices.
 * @param {number} interval - The number of periods to calculate.
 * @return {Array} The list of SMA value.
 */
export const simpleMovingAverage = (prices: number[], interval: number) => {
	let index = interval - 1;
	const length = prices.length + 1;
	let results = [];

	while (index < length) {
		index = index + 1;
		const intervalSlice = prices.slice(index - interval, index);
		const sum = intervalSlice.reduce((prev, curr) => prev + curr, 0);
		results.push(sum / interval);
	}

	return results;
};

/**
 * Generates an array of the next 20(default) days in DD/MM/YYYY format, starting from a given date.
 * @param {string} startDate - The start date in DD/MM/YYYY format.
 * @param {string} size - A number defaults to 20.
 * @returns {string[]} An array of dates in DD/MM/YYYY format.
 */
export function getNextDays(startDate?: "DD/MM/YYYY", size = 20): string[] {
	if (!startDate) return [];
	let dates: string[] = [];
	let [day, month, year] = startDate.split("/").map(Number);

	// JavaScript's Date month index starts from 0, so subtract 1 from the month
	let currentDate = new Date(year, month - 1, day);

	for (let i = 0; i < size; i++) {
		// Add 1 day to the current date
		currentDate.setDate(currentDate.getDate() + 1);

		// Format the date as DD/MM/YYYY
		let formattedDay = String(currentDate.getDate()).padStart(2, "0");
		let formattedMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
		let formattedYear = currentDate.getFullYear();

		dates.push(`${formattedDay}/${formattedMonth}/${formattedYear}`);
	}

	return dates;
}

/**
 * Parses a date string in DD/MM/YY format and returns an object with date, month name, and year.
 * @param {string} dateString - The date string in DD/MM/YY format.
 * @returns An object with date, month name, and year.
 */
export function parseDate(dateString?: string): {
	date: number;
	month: string;
	year: number;
} {
	if (!dateString) return { date: 0, month: "", year: 0 };
	// Define an array of month names
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Split the date string into day, month, and year
	const [day, month, year] = dateString.split("/").map(Number);

	// Convert year to two-digit format if necessary
	const formattedYear = year < 100 ? year : year % 100;

	// Get the month name
	const monthName = monthNames[month - 1];

	return {
		date: day,
		month: monthName,
		year: formattedYear,
	};
}
