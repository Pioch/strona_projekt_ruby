<?php
    $db_host = "localhost";
    $db_name = "WebServer";
    $db_user = "piotr";
    $db_pass = "DomServer123";
    $db_conn = mysqli_connect($db_host, $db_user, $db_pass)
    or die ("Odpowiedź: Błąd połączenia z serwerem $db_host");
    mysqli_select_db($db_conn, $db_name) or die("Trwa konserwacja bazy danych… Odśwież stronę za kilka sekund.");
?>