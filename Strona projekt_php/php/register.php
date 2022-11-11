<?php
    require('db_connection.php');

    $user_fullname = mysqli_real_escape_string($db_conn, $_POST["login"]);
    $user_email = mysqli_real_escape_string($db_conn, $_POST["email"]);
    $user_password = mysqli_real_escape_string($db_conn, $_POST["password"]);
    $user_re_password = mysqli_real_escape_string($db_conn, $_POST["repassword"]);

    $user_passwordhash = password_hash($user_password, PASSWORD_DEFAULT);

    //kilka sprawdzen co do nicku i maila
    $spr1 = mysqli_fetch_array(mysqli_query($db_conn, "SELECT COUNT(*) FROM users WHERE user_fullname='$user_fullname' LIMIT 1")); //czy user o takim nicku istnieje
    $spr2 = mysqli_fetch_array(mysqli_query($db_conn, "SELECT COUNT(*) FROM users WHERE user_email='$email' LIMIT 1")); // czy user o takim emailu istnieje


    if($spr1[0] != 0) {

        echo 'Podana nazwa użytkownika już istnieje'. "<br>\n";

    }

    if($spr2[0] != 0) {
        echo "Taki email już istnieje". "<br>\n";
    }

    if(strlen($user_fullname) < 1) {
        echo 'Niepoprawna nazwa użytkownika'. "<br>\n";
    }

    if(!strpos($user_email, '@')) {
        echo 'Niepoprawny email'. "<br>\n";
    }

    if(strlen($user_password) < 8) {
        echo 'Hasło musi zawierać minimum 8 znaków'. "<br>\n";
    }

    if($user_password != $user_re_password) {
        echo 'Podano różne hasła'. "<br>\n";
    }

    
    if($spr1[0] == 0 && $spr2[0] == 0 && strlen($user_password) > 8) {
        if($spr1 && $spr2 && $user_password == $user_re_password) {
            if(mysqli_query($db_conn, "INSERT INTO users (user_fullname, user_email, user_passwordhash, user_access_level) VALUES('$user_fullname', '$user_email', '$user_passwordhash', 10)")) {
                header('Location: /index.html');
            } 
            else {
                echo "Nieoczekiwany błąd - użytkownik już istnieje lub błąd serwera MySQL.";
            }
        }
    }

    
?>