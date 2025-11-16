'use client'

import { WeeklyAnalytics } from "@/types"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card } from "@/components/atoms/Card"

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
    <Card>
      <h3 className="font-semibold mb-4">Weekly Deficit</h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            className="text-ocean-300"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis
            className="text-ocean-300"
            style={{ fontSize: '0.75rem' }}
          />
          <Bar
            dataKey="deficit"
            className="fill-ocean-400"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-caption">Weekly Avg</p>
          <p className="font-mono font-semibold">-{Math.round(data.average_deficit)} cal</p>
        </div>
        <div>
          <p className="text-caption">Target</p>
          <p className="font-mono font-semibold">-{Math.round(data.target_deficit)} cal</p>
        </div>
      </div>
    </Card>
  )
}
