<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SaleItem;

class sales extends Model
{
    protected $fillable = [
        'quantity',
        'unit_price',
        'total_price',
        'cash_received',
        'change_given',
        'reference',
    ];

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
