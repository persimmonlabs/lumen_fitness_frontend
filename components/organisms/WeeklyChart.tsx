'use client'

import { WeeklyAnalytics } from "@/types"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface WeeklyChartProps {
  data: WeeklyAnalytics
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.daily_data.map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    deficit: Math.abs(day.deficit),
    onTrack: day.on_track,
  }))

  return (
    <div className="bg-ocean-800 rounded-lg p-6">
      <h3 className="font-semibold mb-4">Weekly Deficit</h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#6FB3D1"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6FB3D1"
            style={{ fontSize: '12px' }}
          />
          <Bar
            dataKey="deficit"
            fill="#4A9BC9"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-ocean-400">Weekly Avg</p>
          <p className="font-mono font-semibold">-{Math.round(data.average_deficit)} cal</p>
        </div>
        <div>
          <p className="text-ocean-400">Target</p>
          <p className="font-mono font-semibold">-{Math.round(data.target_deficit)} cal</p>
        </div>
      </div>
    </div>
  )
}
