"use client"

import { WeightEntry } from "@/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"

interface WeightChartProps {
  entries: WeightEntry[]
  loading?: boolean
}

export function WeightChart({ entries, loading = false }: WeightChartProps) {
  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
  )

  // Calculate moving averages
  const calculateMovingAverage = (data: WeightEntry[], window: number) => {
    return data.map((entry, index) => {
      const start = Math.max(0, index - window + 1)
      const subset = data.slice(start, index + 1)
      const avg = subset.reduce((sum, e) => sum + e.weight_kg, 0) / subset.length
      return avg
    })
  }

  const sevenDayAvg = calculateMovingAverage(sortedEntries, 7)
  const thirtyDayAvg = calculateMovingAverage(sortedEntries, 30)

  // Prepare chart data
  const chartData = sortedEntries.map((entry, index) => ({
    date: format(parseISO(entry.measured_at), 'MMM dd'),
    weight: entry.weight_kg,
    avg7: sevenDayAvg[index],
    avg30: thirtyDayAvg[index],
  }))

  if (loading) {
    return (
      <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700 h-80">
        <div className="h-full flex items-center justify-center">
          <div className="text-ocean-400">Loading chart...</div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700 h-80">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-ocean-400">
            <p className="text-lg mb-2">No weight data yet</p>
            <p className="text-sm">Add your first weight entry to see the chart</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ocean-800 rounded-lg p-6 border border-ocean-700">
      <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f2942',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(value: number) => [`${value.toFixed(1)} kg`, '']}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Weight"
          />
          <Line
            type="monotone"
            dataKey="avg7"
            stroke="#0ea5e9"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="7-day avg"
          />
          <Line
            type="monotone"
            dataKey="avg30"
            stroke="#eab308"
            strokeWidth={2}
            dot={false}
            name="30-day avg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
