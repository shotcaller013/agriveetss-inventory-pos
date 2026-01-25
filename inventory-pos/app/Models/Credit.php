<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CreditItem;

class Credit extends Model
{
    //
    protected $fillable = [
        'customer_name',
        'due_date',
        'total_amount'
    ];

    protected $casts = [
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(CreditItem::class);
    }
}
