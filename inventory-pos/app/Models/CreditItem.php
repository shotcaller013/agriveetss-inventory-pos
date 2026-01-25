<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditItem extends Model
{
    //
    protected  $fillable =[
        'credit_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function credit()
    {
        return $this->belongsTo(Credit::class);
    }

}
