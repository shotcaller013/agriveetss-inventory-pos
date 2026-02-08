<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Credit;

class CreditPayment extends Model
{
    protected $fillable = [
        'credit_id',
        'amount_paid',
        'payment_method',
        'reference',
        'paid_at',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function credit()
    {
        return $this->belongsTo(Credit::class, 'credit_id');
    }
}
