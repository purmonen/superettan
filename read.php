<?php
$url = 'http://www.superettan.se/tabell/';
$content = file_get_contents($url);

echo $content;
?>
