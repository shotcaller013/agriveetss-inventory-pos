<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Sales;
use App\Models\Product;

class SalesController extends Controller
{
    public function storeSale(Request $request)
    {
        $data = $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.01',
            'cash'               => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($data) {

            $total = 0;

            $products = Product::lockForUpdate()
                ->whereIn('id', collect($data['items'])->pluck('product_id'))
                ->get()
                ->keyBy('id');

            foreach ($data['items'] as $item) {
                $product = $products[$item['product_id']];

                if ($product->stock_qty < $item['quantity']) {
                    abort(422, "Insufficient stock for {$product->name}");
                }

                //  USE DB PRICE
                $total += $item['quantity'] * $product->selling_price;
            }

            $change = $data['cash'] - $total;

            if ($change < 0) {
                abort(422, 'Insufficient cash');
            }

            $reference = 'SALE-' . now()->format('Ymd') . '-' . (Sales::max('id') + 1);

            $sale = Sales::create([
                'total_price'   => $total,
                'cash_received' => $data['cash'],
                'change_given'  => $change,
                'reference'     => $reference,
            ]);

            foreach ($data['items'] as $item) {
                $product = $products[$item['product_id']];

                $sale->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $product->selling_price, //  DB price
                    'cost_price' => $product->cost_price,    //  profit-safe
                    'subtotal'   => $item['quantity'] * $product->selling_price,
                ]);

                $product->decrement('stock_qty', $item['quantity']);
            }

            $sale->load('items.product:id,name');

            return response()->json([
                'success' => true,
                'sale'    => $sale,
            ], 201);
        });
    }
}
