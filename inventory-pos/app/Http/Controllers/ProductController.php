<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;


class ProductController extends Controller
{
    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit_type' => 'required|in:kg,pcs,pack',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock_qty' => 'nullable|numeric|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'unit_type' => 'sometimes|required|in:kg,pcs,pack',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'selling_price' => 'sometimes|required|numeric|min:0',
            'stock_qty' => 'sometimes|nullable|numeric|min:0',
        ]);

        $product = Product::findOrFail($id);
        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function fetchProduct(Request $request)
    {
        
        $query = Product::orderBy('id');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->boolean('paginate') === false) {
            return response()->json([
                'data' => $query->get(),
            ]);
        }

        $products = $query->cursorPaginate(10);

        return response()->json([
            'data' => $products->items(),
            'next_cursor' => optional($products->nextCursor())->encode(),
            'prev_cursor' => optional($products->previousCursor())->encode(),
        ]);
    }


    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    public function dashboardData()
    {
        dd('test');
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
            ->limit(5)
            ->get();

        return response()->json([
            'top_products' => $topProducts,
        ]);
    }
}
