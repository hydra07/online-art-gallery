'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visits: 4000, interactions: 2400 },
  { name: 'Tue', visits: 3000, interactions: 1398 },
  { name: 'Wed', visits: 2000, interactions: 9800 },
  { name: 'Thu', visits: 2780, interactions: 3908 },
  { name: 'Fri', visits: 1890, interactions: 4800 },
];

export function UserActivityChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#8884d8" />
          <Bar dataKey="interactions" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}