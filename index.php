<?php
require 'vendor/autoload.php';

use Upyun\Config;
use Upyun\Signature;

$bucketConfig = new Config('miniprogram', 'admin' , 'xdxd1078' );


// echo md5('Apple', FALSE);
$str = 'Hello UPYUN';
$str2 = base64_encode($str);
$arr1 = hash_algos();

var_dump(md5_file('43455.jpg'));
// var_dump(strlen($str), strlen($str2), $str2);