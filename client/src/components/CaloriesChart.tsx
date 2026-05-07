import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAppContext } from "../context/useAppContext";
import { buildWeeklyChartData } from "../utils/chartData";

const CaloriesChart = () => {
  const { allActivityLogs, allFoodLogs } = useAppContext();

  const data = buildWeeklyChartData(allFoodLogs, allActivityLogs);

  return (
    <div className="w-full h-76 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            className="dark:stroke-slate-700"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            className="dark:text-slate-400"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            className="dark:text-slate-400"
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
          <Bar
            dataKey="Intake"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={12}
            name="Intake"
          />
          <Bar
            dataKey="Burn"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
            barSize={12}
            name="Burn"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
