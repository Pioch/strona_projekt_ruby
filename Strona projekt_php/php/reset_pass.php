<?php

if($_GET['key'] && $_GET['reset'])
{
    require('db_connection.php');
    $email=$_GET['key'];
    $pass=$_GET['reset'];

    $select=mysqli_query($db_conn, "select user_email, user_passwordhash from users where md5(user_email)='$email' and user_passwordhash='$pass'");
    if(mysqli_num_rows($select)==1)
    {
        ?>
        <form method="post" action="submit_new_pass.php">
            <input type="hidden" name="email" value="<?php echo $email;?>">
            <p>Enter New password</p>
            <input type="password" name='password'>
            <input type="password" name='repassword'>
            <input type="submit" name="submit_password">
        </form>
        <?php
    }
    }
?>