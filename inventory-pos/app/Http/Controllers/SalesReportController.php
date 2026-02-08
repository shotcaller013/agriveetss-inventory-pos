<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesReportController extends Controller
{
    //
    public function dailySales(Request $request)
    {
        $from = $request->from ?? now()->toDateString();
        $to   = $request->to ?? now()->toDateString();

        // 1. Fetch Standard Sales
        $sales = DB::table('sales as s')
            ->join('sale_items as si', 'si.sales_id', '=', 's.id')
            ->selectRaw('
            s.reference as sale_id,
            SUM(si.subtotal) as sale_total,
            s.created_at,
            "Direct Sale" as type
        ')
            ->whereBetween(DB::raw('DATE(s.created_at)'), [$from, $to])
            ->groupBy('s.id', 's.reference', 's.created_at')
            ->get();

        // 2. Fetch Credit Collections (Payments)
        $collections = DB::table('credit_payments as cp')
            ->join('credits as c', 'cp.credit_id', '=', 'c.id')
            ->selectRaw('
            cp.reference as sale_id,
            cp.amount_paid as sale_total,
            cp.paid_at as created_at,
            CONCAT("Collection: ", c.customer_name) as type
        ')
            ->whereBetween(DB::raw('DATE(cp.paid_at)'), [$from, $to])
            ->get();

        // 3. Merge and Sort
        $allActivity = $sales->concat($collections)->sortByDesc('created_at')->values();

        // 4. Calculate Summary Data
        $salesSummary = DB::table('sales as s')
            ->join('sale_items as si', 'si.sales_id', '=', 's.id')
            ->whereBetween(DB::raw('DATE(s.created_at)'), [$from, $to])
            ->selectRaw('
            SUM(si.subtotal) as total_sales_volume,
            SUM(si.quantity) as total_qty,
            SUM((si.unit_price - si.cost_price) * si.quantity) as total_profit
        ')
            ->first();

        $collectionTotal = DB::table('credit_payments')
            ->whereBetween(DB::raw('DATE(paid_at)'), [$from, $to])
            ->sum('amount_paid');

        return response()->json([
            'activity' => $allActivity,
            'summary' => [
                'transactions' => $sales->count() + $collections->count(),
                'total_sales_volume' => (float)($salesSummary->total_sales_volume ?? 0),
                'total_collections' => (float)$collectionTotal,
                'total_cash_inflow' => (float)($salesSummary->total_sales_volume ?? 0) + $collectionTotal,
                'total_qty' => (float)($salesSummary->total_qty ?? 0),
                'total_profit' => (float)($salesSummary->total_profit ?? 0)
            ],
        ]);
    }
}
