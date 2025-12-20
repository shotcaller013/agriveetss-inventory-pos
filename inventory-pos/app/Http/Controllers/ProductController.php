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
            'sku' => 'nullable|string|unique:products,sku',
            'unit_type' => 'required|in:kg,pcs,pack',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock_qty' => 'nullable|numeric|min:0',
            'reorder_level' => 'nullable|numeric|min:0',
        ]);
        $product = Product::create($validated);

        return response()->json($product, 201);
    }
}
