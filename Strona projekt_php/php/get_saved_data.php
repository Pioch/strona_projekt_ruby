<?php 
    require('db_connection.php');

    session_start();
    $login = $_SESSION["user_name"];
    $saved = mysqli_query($db_conn, "SELECT * FROM blender_data WHERE user = '$login'");
    $saved_json = array();
    $i = 0;

    while($row = mysqli_fetch_array($saved)) {
        $saved_json[$i]["id"] = $row["id"];
        $saved_json[$i]["user"] = $row["user"];
        $saved_json[$i]["saved_json"] = $row["saved_json"];
        $saved_json[$i]["data"] = $row["data"];
        $i++;
    }

    echo json_encode($saved_json);

?>