<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Credit;
use App\Models\CreditItem;
use Illuminate\Support\Facades\DB;

class CreditController extends Controller
{
    //
    public function storeCredit(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
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
            ]);


            foreach ($data['items'] as $item) {
                CreditItem::create([
                    'credit_id' => $credit->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return response()->json(['message' => 'Credit record created successfully.'], 201);
    }
}
