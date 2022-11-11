$.getJSON('php/get_user_data.php', (data) => {
    login = data;
    $('#login').text(login);

    if(login == null) {
        window.location.href = '/index.html';
    }
    
})