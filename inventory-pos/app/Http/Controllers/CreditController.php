<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Credit;
use App\Models\CreditItem;
use App\Models\Product;
use App\Models\CreditPayment;

class CreditController extends Controller
{
    /**
     * Store a new credit record with atomicity
     */
    public function storeCredit(Request $request)
    {
        $data = $request->validate([
            'customer_name'  => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'due_date'       => 'required|date',
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $totalAmount = collect($data['items'])->sum(fn($item) => $item['quantity'] * $item['unit_price']);

        try {
            return DB::transaction(function () use ($data, $totalAmount) {
                // 1. Create Credit Header
                $credit = Credit::create([
                    'customer_name'  => $data['customer_name'],
                    'contact_number' => $data['contact_number'],
                    'due_date'       => $data['due_date'],
                    'total_amount'   => $totalAmount,
                    'status'         => 'open',
                ]);

                // 2. Process Items and Inventory
                foreach ($data['items'] as $item) {
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    if ($product->stock_qty < $item['quantity']) {
                        throw new \Exception("Insufficient stock for {$product->name}");
                    }

                    $credit->items()->create([
                        'product_id' => $item['product_id'],
                        'quantity'   => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal'   => $item['quantity'] * $item['unit_price'],
                    ]);

                    $product->decrement('stock_qty', $item['quantity']);
                }

                return response()->json(['message' => 'Credit record created successfully.'], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Fetch all credits with payments and balance calculation
     */
    public function fetchCredits()
    {
        // Eager load everything needed for the UI
        $overdueCount = Credit::where('due_date', '<', now()->toDateString())
            ->where('status', '!=', 'paid') // optional
            ->count();


        $credits = Credit::with(['items.product', 'payments'])
            ->latest()
            ->get()
            ->map(function ($credit) {
                $totalPaid = $credit->payments->sum('amount_paid');

                return [
                    'id'                => $credit->id,
                    'customer_name'     => $credit->customer_name,
                    'contact_number'    => $credit->contact_number,
                    'due_date'          => $credit->due_date->format('F j, Y'),
                    'total_amount'      => $credit->total_amount,
                    'remaining_balance' => $credit->total_amount - $totalPaid,
                    'status'            => $credit->status,
                    'items'             => $credit->items->map(fn($item) => [
                        'product_name' => $item->product->name ?? 'Deleted Product',
                        'quantity'     => $item->quantity,
                        'unit_price'   => $item->unit_price,
                        'subtotal'     => $item->subtotal,
                    ]),
                    'payments'          => $credit->payments->map(fn($p) => [
                        'amount_paid'    => $p->amount_paid,
                        'payment_method' => $p->payment_method,
                        'paid_at'        => $p->paid_at,
                    ]),
                ];
            });

        return response()->json([
            'credits' => $credits,
            'overdueCount' => $overdueCount,
        ]);
    }



    /**
     * Process a partial or full payment
     */
    public function processPayment(Request $request, Credit $credit)
    {
        $data = $request->validate([
            'amount_paid'    => 'required|numeric|min:0.01',
            'payment_method' => 'nullable|string|max:50',
            'reference'      => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($data, $credit) {
            $credit->payments()->create([
                'amount_paid'    => $data['amount_paid'],
                'payment_method' => $data['payment_method'] ?? 'cash',
                'reference'      => $data['reference'] ?? 'PAY-' . now()->format('Ymd') . '-' . (Credit::max('id') + 1),
                'paid_at'        => now(),
            ]);

            // Recalculate status
            $totalPaid = $credit->payments()->sum('amount_paid');

            $newStatus = 'partial';
            if ($totalPaid >= $credit->total_amount) {
                $newStatus = 'paid';
            }

            $credit->update(['status' => $newStatus]);

            return response()->json([
                'message'           => 'Payment recorded.',
                'remaining_balance' => $credit->total_amount - $totalPaid,
                'status'            => $newStatus
            ]);
        });
    }
}
