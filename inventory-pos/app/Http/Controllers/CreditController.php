<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Credit;
use App\Models\CreditItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;


class CreditController extends Controller
{
    //
    public function storeCredit(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'due_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);


        $totalAmount = collect($data['items'])->sum(
            fn($item) => $item['quantity'] * $item['unit_price']
        );

        DB::transaction(function () use ($data, $totalAmount) {
            $credit = Credit::create([
                'customer_name' => $data['customer_name'],
                'due_date' => $data['due_date'],
                'total_amount' => $totalAmount,
                'contact_number' => $data['contact_number'],
            ]);


            foreach ($data['items'] as $item) {
                CreditItem::create([
                    'credit_id' => $credit->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);

                $product = Product::lockForUpdate()->find($item['product_id']);
                $product->decrement('stock_qty', $item['quantity']);
            }
        });

        return response()->json(['message' => 'Credit record created successfully.'], 201);
    }

    public function fetchCredits()
    {
        $credits = Credit::with('items')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($credit) {
                return [
                    'id' => $credit->id,
                    'customer_name' => $credit->customer_name,
                    'due_date' => $credit->due_date->format('M d, Y'),
                    'contact_number' => $credit->contact_number,
                    'total_amount' => number_format($credit->total_amount, 2),
                    'items' => $credit->items->map(function ($item) {
                        return [
                            // 'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'unit_price' => number_format($item->unit_price, 2),
                            'subtotal' => number_format($item->subtotal, 2),
                            'product_name' => $item->product->name ?? 'Unknown Product',
                        ];
                    }),

                ];

            });

        return response()->json([
            'credits' => $credits
        ]);
    }
}
