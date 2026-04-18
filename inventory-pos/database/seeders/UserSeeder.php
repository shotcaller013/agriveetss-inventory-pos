<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@pos.local'], // condition
            [
                'name' => 'admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'cashier@pos.local'], // condition
            [
                'name' => 'cashier',
                'password' => Hash::make('cashier123'),
                'role' => 'cashier',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
