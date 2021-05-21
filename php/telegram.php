<?php

$nameGood => $_POST['name'],
$ing = $_POST['ing'];

$token = '1700135368:AAFDdPSEx9MHKuFnI8g0xWlihw-bTWttpwQ';
$chatId = '-570341299';

$arrDate = array(
    'Название:' => $nameGood,
    'Список продуктов: ' => $ing
);

foreach($arrDate as $key => $value) {
    $txt .= '<b>'.$key.'</b> '.$value.'%0A <br>';
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chatId}&parse_mode=html&text={$txt}","r");

if ($sendToTelegram) {
    echo 'Yes';
} else {
    echo 'Error';
}

?>