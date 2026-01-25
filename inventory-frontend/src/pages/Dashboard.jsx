import MainLayout from "../layout/MainLayout"
import ChartBarLabel from "../components/ChartBarLabel"
import { Trophy } from "lucide-react"
import api from "../api/axios";

import { useState, useEffect } from "react"

export default function DashBoard() {
    const [dashboard, setDashboard] = useState([])

    // fetch dashboard data
    useEffect(function () {
        async function fetchDashboard() {
            try {
                const res = await api.get("/sales/top")
                setDashboard(res.data.top_products || [])
            } catch (err) {
                console.error(err)
                setDashboard([])
            }
        }

        fetchDashboard()
    }, [])

    return (
        <MainLayout>
            <div className="flex w-full justify-center gap-2 p-4">
                {/* Chart */}
                <div className="w-3/4 rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    <ChartBarLabel />
                </div>

                {/* Top Sales */}
                <div className="w-full max-w-[450px] rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    <div className="p-4">
                        <h3 className="mb-4 text-md font-bold text-slate-800">
                            Top 3 Sales
                        </h3>

                        {dashboard.length === 0 ? (
                            <p className="text-sm text-gray-400">No data available</p>
                        ) : (
                            <ul className="space-y-3">
                                {dashboard.slice(0, 3).map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Trophy
                                                className={`h-5 w-5 ${index === 0
                                                        ? "text-yellow-500"
                                                        : index === 1
                                                            ? "text-gray-400"
                                                            : "text-amber-700"
                                                    }`}
                                            />
                                            <span className="text-md">{item.name}</span>
                                        </div>

                                        <span className="font-semibold text-green-600">
                                            ₱{Number(item.total_sales).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
