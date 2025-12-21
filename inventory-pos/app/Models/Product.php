<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'unit_type',
        'cost_price',
        'selling_price',
        'stock_qty',
        'reorder_level',
        'is_active',
    ];

    protected $casts = [
        'cost_price'    => 'decimal:2',
        'selling_price' => 'decimal:2',
        'stock_qty'     => 'integer',
        'reorder_level' => 'integer',
        'is_active'     => 'boolean',
    ];
}

