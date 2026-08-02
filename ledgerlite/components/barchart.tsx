"use client";


import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart() {
  const baroptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const barData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Days vs Cashflow In",
        data: [12000, 14500, 23000, 17000, 24500, 600000, 953000],
        backgroundColor: ["green"],

        borderRadius: 6,
      },
    ],
    datasets2: [
      {
        label: "Days vs Cashflow Out",
        data: [10000, 12500, 16000, 17500, 14500, 600000, 853000],
        backgroundColor: ["red"],

        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <div>
        <div className="mt-10">
          <h4>Money In versus Money Out</h4>
          <p>see how ,oney ,over through your business over</p>
        </div>
      </div>
      <div className="flex flex-col items-center pt-20">
        {/* <h3 className="text-2xl font-semibold mb-6">My page</h3> */}

        <div className="w-full max-w-4xl ">
          <div style={{ width: "100%", height: "380px" }}>
            <Bar data={barData} options={baroptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
