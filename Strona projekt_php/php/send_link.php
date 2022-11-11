<?php
    require "db_connection.php";
    //require "mailer/files/db_connection2.php";
    include "mailer/files/Exception.php";
    include "mailer/files/PHPMailer.php";
    include "mailer/files/SMTP.php" ;


    $input_email = mysqli_real_escape_string($db_conn, $_POST["email"]);

    $query_user = mysqli_query($db_conn, "SELECT * FROM users WHERE user_email='$input_email'");
    
    if(mysqli_num_rows($query_user)==1) {
        $record = mysqli_fetch_array($query_user);
        $email= $record['user_email'];
        $email_hash = md5($record['user_email']);
        $pass=$record['user_passwordhash'];
    
        $link="<a href='https://partisan-armadillo-0984.dataplicity.io/php/reset_pass.php?key=".$email_hash."&reset=".$pass."'>Click To Reset password</a>";

        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->IsSMTP(); // enable SMTP
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Port = 465;
        $mail->Username = 'pitertest0408@gmail.com';
        $mail->Password = 'pbfhtruljczcbbtg';
        $mail->SMTPSecure = "ssl"; 
        $mail->From='pitertest0408@gmail.com';
        $mail->FromName='Piotr';
        $mail->AddAddress($email);
        $mail->Subject  =  'Reset Password';
        $mail->IsHTML(true);
        $mail->Body = 'Click On This Link to Reset Password '.$link.'';
        if($mail->Send())
        {
          echo 'Sprawdź maila i kliknij na otrzymane łącze';
        }
        else
        {
          echo "Mail Error - >".$mail->ErrorInfo;
        }  

    }
    else  {
      echo 'Podano zły adres mail';
    }
   
?>