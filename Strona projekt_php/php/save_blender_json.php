<?php
    require('db_connection.php');

    session_start();
    $user_login = $_SESSION["user_name"];
    $json_to_save = file_get_contents('php://input');


    mysqli_query($db_conn, "INSERT INTO blender_data (user, saved_json) VALUES('$user_login', '$json_to_save')");
?>