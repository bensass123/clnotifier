





$(document).ready(function() {

    // logout button
    $('#logout').click(()=>{
        $.post('/logout');
        setTimeout(()=>{
            location.reload();
        }, 400);
    })

    // initiate user in db if not already there
    $.post('/inituser', (data) => {
        console.log(data);
    })

    // initiate clockpicker plugin
    $('.clockpicker').clockpicker();

    // populate welcomename in jumbotron
    $.get('/user', function(res){
        console.log(res)
        var n = res.givenName;
        $('#welcomename').html(n);
    })


})