<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CreditItem;
use App\Models\CreditPayment;

class Credit extends Model
{
    protected $fillable = [
        'customer_name',
        'contact_number',
        'due_date',
        'total_amount',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(CreditItem::class, 'credit_id');
    }

    public function payments()
    {
        return $this->hasMany(CreditPayment::class, 'credit_id');
    }

    public function getAmountPaidAttribute()
    {
        return $this->payments()->sum('amount_paid');
    }

    public function getAmountDueAttribute()
    {
        return max(0, $this->total_amount - $this->amount_paid);
    }
}
