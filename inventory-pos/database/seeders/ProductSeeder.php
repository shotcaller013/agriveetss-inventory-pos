<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            ['name' => 'Pigro Premium Starter', 'unit_type' => 'kg', 'cost_price' => 40, 'selling_price' => 49, 'stock_qty' => 1211, 'image' => 'products/oWENAVNgkoiLPKYd9VqOPiVEUNKpRTQHFPw5kjuX.png'],

            ['name' => 'Pigro Vital Hog Gestation', 'unit_type' => 'kg', 'cost_price' => 38, 'selling_price' => 43, 'stock_qty' => 165, 'image' => 'products/jPEOQWwnHZqhAfPsPpaTE4mZn3aANeZqj8a0agjM.png'],

            ['name' => 'Pigro Vital Hog Grower', 'unit_type' => 'kg', 'cost_price' => 40, 'selling_price' => 45, 'stock_qty' => 21, 'image' => 'products/kdJbP5MXh8SPFbawDynzhYb222WJBqOqrtChfiQV.png'],

            ['name' => 'Pigro Milkmaker', 'unit_type' => 'kg', 'cost_price' => 45, 'selling_price' => 50, 'stock_qty' => 140, 'image' => 'products/4xQQTfKIYxE9BDQJlQcOrU5TE5kMKayPiUYpWms6.png'],

            ['name' => 'Pigro Premium Finisher', 'unit_type' => 'kg', 'cost_price' => 42, 'selling_price' => 47, 'stock_qty' => 107, 'image' => 'products/6fhSN8niORM1TykD47azV0JC802cKU0UaJC7Zfpp.png'],

            ['name' => 'Early Wean', 'unit_type' => 'pack', 'cost_price' => 105, 'selling_price' => 110, 'stock_qty' => 176, 'image' => 'products/6OhztVkJTHtESf2I15OolJBGLdx60DkfQ9g5Xj5b.png'],

            ['name' => 'BSB', 'unit_type' => 'pack', 'cost_price' => 52, 'selling_price' => 57, 'stock_qty' => 128, 'image' => 'products/6m4xB1OdFXdjMes0saWvllON9KlEnJyc8qpHtrnE.png'],

            ['name' => 'Stag Dev 1-4', 'unit_type' => 'pack', 'cost_price' => 58, 'selling_price' => 63, 'stock_qty' => 188, 'image' => 'products/c5v2h8p7zk2YgiNLiv6XEoqs43elKnxz28cd4hyx.png'],

            ['name' => 'Stag Dev 4+', 'unit_type' => 'pack', 'cost_price' => 57, 'selling_price' => 62, 'stock_qty' => 187, 'image' => 'products/kZkfmAt82dSazN9Fkjg4XFANHrPVFYAKdi4fVVwK.png'],

            ['name' => 'Thunderbird Platinum', 'unit_type' => 'pack', 'cost_price' => 65, 'selling_price' => 70, 'stock_qty' => 188, 'image' => 'products/29r5UBcwyeMJjTCO1ohz0IQWp2Cw1DCTqyaOv3W6.png'],

            ['name' => 'Enertone (Pack)', 'unit_type' => 'pack', 'cost_price' => 47, 'selling_price' => 52, 'stock_qty' => 188, 'image' => 'products/XoMjTgfVBrAAJbxrVskuE25z072JSqUSHIkc1W4l.png'],

            ['name' => 'Enertone (Kg)', 'unit_type' => 'kg', 'cost_price' => 44, 'selling_price' => 49, 'stock_qty' => 200, 'image' => 'products/BBOp9pXNnpbVahxQviTkOQyOKu9wz76IvorIcsKA.png'],

            ['name' => 'Slasher', 'unit_type' => 'kg', 'cost_price' => 45.5, 'selling_price' => 50.5, 'stock_qty' => 200, 'image' => 'products/ZM02IOaMR14ybUHoKDoqtHfoiFk3vy6XRMVALZlA.png'],

            ['name' => 'Crack Corn', 'unit_type' => 'kg', 'cost_price' => 45, 'selling_price' => 50, 'stock_qty' => 188, 'image' => 'products/gynIUpnVWtoNgx8JKCKslyzRp9p90k8rtvFLlmf8.png'],

            ['name' => 'Ready Mix', 'unit_type' => 'kg', 'cost_price' => 42, 'selling_price' => 47, 'stock_qty' => 200, 'image' => 'products/zQIsPQ9r46NILRhGv5W1jlB3Llgh8QfKC4yicmou.png'],

            ['name' => '16 Kinds', 'unit_type' => 'kg', 'cost_price' => 40, 'selling_price' => 45, 'stock_qty' => 200, 'image' => 'products/YJZirsDBPYgf73uO9j6hVJ4oQjYgRmiVhoBOaz7h.png'],

            ['name' => '7 Kinds', 'unit_type' => 'kg', 'cost_price' => 38, 'selling_price' => 43, 'stock_qty' => 200, 'image' => 'products/Hd5mJnAEbnLouftKsHcg7AitkkrfkgrnZMJbeLFR.png'],

            ['name' => 'GF 2k', 'unit_type' => 'kg', 'cost_price' => 42, 'selling_price' => 47, 'stock_qty' => 200, 'image' => 'products/eBcqZlzOQJ4XJ0tqKELGyfSrCdlW4I5aOUGETdi9.png'],

            ['name' => 'Galli 1', 'unit_type' => 'kg', 'cost_price' => 45.5, 'selling_price' => 50.5, 'stock_qty' => 200, 'image' => 'products/4W4mGYFCl00tgrGOQK7FRYfV49LZZZHdxZNG5U3v.png'],

            ['name' => 'Galli 2', 'unit_type' => 'kg', 'cost_price' => 44.5, 'selling_price' => 49.5, 'stock_qty' => 200, 'image' => 'products/OFNdbaqruWw3NRcnjDEtMKR4mVKWRkpj7AHyKV9U.png'],

            ['name' => 'Galli 3', 'unit_type' => 'kg', 'cost_price' => 40, 'selling_price' => 45, 'stock_qty' => 200, 'image' => 'products/BuSToS23iM2yDlEYJxYpZrcEU93iPECs03FnvT7q.png'],

            ['name' => 'B50', 'unit_type' => 'pcs', 'cost_price' => 9, 'selling_price' => 14, 'stock_qty' => 200, 'image' => 'products/zOe4LkM2oePEbFhB5dC102zWyK5dVYLlgwqDJV5i.png'],

            ['name' => 'Amtyl', 'unit_type' => 'pcs', 'cost_price' => 10, 'selling_price' => 15, 'stock_qty' => 200, 'image' => 'products/GHwe5IQ38MvnnBdCzYRVCK6I3r4EA2Ilb6LG4fVG.png'],

            ['name' => 'Doxilac', 'unit_type' => 'pcs', 'cost_price' => 10, 'selling_price' => 15, 'stock_qty' => 200, 'image' => 'products/0IWjsMSCVI5agv17QVsxl2rulBd2sbfO4CMamZ7v.png'],

            ['name' => 'Vitmin Pro', 'unit_type' => 'pack', 'cost_price' => 25, 'selling_price' => 30, 'stock_qty' => 200, 'image' => 'products/k091hKFFswglRoONDBMP9MC7thBjakKaR7UJlt3f.png'],

            ['name' => 'Ambroxtyl', 'unit_type' => 'pack', 'cost_price' => 35, 'selling_price' => 40, 'stock_qty' => 10001, 'image' => 'products/XwQ9JzIC6CONvzX7TZpuvFt6nopTYRqpz8Fd5yxS.png'],

            ['name' => 'Vetracin Gold', 'unit_type' => 'pack', 'cost_price' => 25, 'selling_price' => 30, 'stock_qty' => 200, 'image' => 'products/gqWtXMmqPkboMXTAcapr8fumAu5u1myRRyo8DUn9.png'],

            ['name' => 'Vetracin Classic', 'unit_type' => 'pack', 'cost_price' => 25, 'selling_price' => 30, 'stock_qty' => 200, 'image' => 'products/IbWYSbKSscOE4dMRsvsmBEsFbF0R3eNAtPxFhSWQ.png'],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['name' => $product['name']],
                array_merge($product, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
