<?php

    $email=$_POST['email'];
    $pass=$_POST['password'];
    $repass=$_POST['repassword'];
    require('db_connection.php');
    
    if($pass == $repass) {
        $passwordhash = password_hash($pass, PASSWORD_DEFAULT);
        $select=mysqli_query($db_conn, "Update users Set user_passwordhash='$passwordhash' where md5(user_email)='$email'");
        header('Location: /index.html');
    }
    else {
        echo 'Podano różne hasła'. "<br>\n";
    }

?>