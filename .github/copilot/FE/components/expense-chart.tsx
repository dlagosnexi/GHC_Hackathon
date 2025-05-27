"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { name: "Jan", amount: 1200 },
  { name: "Feb", amount: 900 },
  { name: "Mar", amount: 1500 },
  { name: "Apr", amount: 1100 },
  { name: "May", amount: 1800 },
  { name: "Jun", amount: 1400 },
  { name: "Jul", amount: 2000 },
  { name: "Aug", amount: 1700 },
  { name: "Sep", amount: 1900 },
  { name: "Oct", amount: 2200 },
  { name: "Nov", amount: 1800 },
  { name: "Dec", amount: 2400 },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-primary">{`$${payload[0].value?.toFixed(2)}`}</p>
      </div>
    )
  }

  return null
}

export function ExpenseChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? "#ccc" : "#666" }}
            tickLine={{ stroke: isDark ? "#666" : "#ccc" }}
          />
          <YAxis
            tick={{ fill: isDark ? "#ccc" : "#666" }}
            tickLine={{ stroke: isDark ? "#666" : "#ccc" }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
