<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SaleItem;

class Sales extends Model
{
    protected $fillable = [
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
