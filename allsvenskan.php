<?php
$url = 'http://www.allsvenskan.se/tabell/';
$content = file_get_contents($url);

echo $content;
?>
