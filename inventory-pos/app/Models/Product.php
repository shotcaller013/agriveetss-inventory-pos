<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'unit_type',
        'cost_price',
        'selling_price',
        'stock_qty',
        'reorder_level',
        'image',
    ];

    protected $casts = [
        'cost_price'    => 'decimal:2',
        'selling_price' => 'decimal:2',
        'stock_qty'     => 'integer',
        'reorder_level' => 'integer',
        'deleted_at'    => 'datetime',
    ];
}

