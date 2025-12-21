<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function store(Request $request)
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
            'product' => $product
        ], 201);
    }

    public function fetchProduct(Request $request)
    {
        $query = Product::query()->orderBy('id');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->cursorPaginate(10);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'next_cursor' => $products->nextCursor()?->encode(),
        ]);
    }
}
