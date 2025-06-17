<?php
namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;
use Osiset\ShopifyApp\Traits\ShopModel;
class User extends Authenticatable implements IShopModel
{
use Notifiable;
use ShopModel;
/**
* The attributes that are mass assignable.
*
* @var array
*/
protected $fillable = [

'name', 'email', 'password',
];
/**
* The attributes that should be hidden for arrays.
*
* @var array
*/
protected $hidden = [
'password', 'remember_token',
];
/**
* Get the attributes that should be cast.
*
* @return array<string, string>
*/
protected function casts(): array
{
return [
'email_verified_at' => 'datetime',
// 'password' => 'hashed',
];
}
}