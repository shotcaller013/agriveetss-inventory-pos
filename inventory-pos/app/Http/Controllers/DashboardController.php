<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    //
    public function data(Request $request)
    {
        $topProducts = DB::table('sale_items as qty')
            ->leftJoin('products as pr', 'pr.id', '=', 'qty.product_id')
            ->select(
                'pr.id',
                'pr.name',
                DB::raw('SUM(qty.quantity) as total_quantity'),
                DB::raw('SUM(qty.quantity * qty.unit_price) as total_sales')
            )
            ->groupBy('pr.id', 'pr.name')
            ->orderByDesc('total_sales')
            ->limit(10)
            ->get();


        return response()->json([
            'top_products' => $topProducts,
        ]);
    }
}
