import { TrendingUp } from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
    ResponsiveContainer,
} from "recharts"
import { useState, useEffect } from "react"
import api from "../api/axios"

export default function ChartBarLabel() {
    const [chartData, setChartData] = useState([])

    useEffect(function () {
        async function fetchDashboard() {
            try {
                const res = await api.get("/sales/top")

                const formatted = (res.data.top_products || []).map(item => ({
                    name: item.name,
                    sales: Number(item.total_sales),
                }))

                setChartData(formatted)
            } catch (err) {
                console.error(err)
                setChartData([])
            }
        }

        fetchDashboard()
    }, [])

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                    Top Products Sales
                </h3>
                <p style={{ fontSize: 12, color: "#6b7280" }}>
                    Based on total sales
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    />

                    <Bar dataKey="sales" radius={8}>
                    <LabelList position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 16, fontSize: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <strong>Top performing products</strong>
                    <TrendingUp size={16} />
                </div>
                <div style={{ color: "#6b7280", marginTop: 4 }}>
                    Showing highest total sales
                </div>
            </div>
        </div>
    )
}
