<?php 

    require('db_connection.php');

    $json_to_encode = array();
    session_start();
    $json_to_encode = $_SESSION["user_name"];

    echo json_encode($json_to_encode);
   
?>