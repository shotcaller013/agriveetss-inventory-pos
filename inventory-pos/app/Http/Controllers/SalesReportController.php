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

        $sales = DB::table('sales as s')
            ->join('sale_items as si', 'si.sales_id', '=', 's.id')
            ->selectRaw('
        s.reference as sale_id,
        SUM(si.subtotal) as sale_total,
        s.created_at
    ')
            ->whereBetween(DB::raw('DATE(s.created_at)'), [$from, $to])
            ->groupBy('s.id', 's.reference', 's.created_at') 
            ->orderBy('s.created_at', 'desc')
            ->get();


        $summary = DB::table('sales as s')
            ->join('sale_items as si', 'si.sales_id', '=', 's.id')
            ->whereBetween(DB::raw('DATE(s.created_at)'), [$from, $to])
            ->selectRaw('
                COUNT(DISTINCT s.id) as transactions,
                SUM(si.quantity) as total_qty,
                SUM(si.subtotal) as total_sales,
                SUM((si.unit_price - si.cost_price) * si.quantity) as total_profit
            ')
            ->first();



        return response()->json([
            'sales' => $sales,
            'summary' => $summary,
        ]);
    }
}
