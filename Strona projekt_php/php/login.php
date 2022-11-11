<?php
    require('db_connection.php');

    $user_login = mysqli_real_escape_string($db_conn, $_POST["login"]);
    $user_password = mysqli_real_escape_string($db_conn, $_POST["password"]);

    $query_login = mysqli_query($db_conn, "SELECT * FROM users WHERE user_fullname ='$user_login'");

    if(mysqli_num_rows($query_login) > 0) {
        $record = mysqli_fetch_assoc($query_login);
        $hash = $record["user_passwordhash"];

        if(password_verify($user_password, $hash)) {
            session_start();
            $_SESSION["current_user"] = $record["user_id"];
            $_SESSION["user_name"] = $record["user_fullname"];
            $_SESSION["access_level"] = $record["user_access_level"];
   
        }
     }

     if (isset($_SESSION["current_user"])){
        /* Użytkownik jest zalogowany */
        echo "Zalogowano";
        header('Location: /blender_projekt.html');
        

     } else {
        /* Użytkownik nie jest zalogowany */
        echo "Błąd logowania";
     }

?>
