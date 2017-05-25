// globals
// will hold email of user
var email;



var fillit = (obj, template, divtofill) => {
        var source   = $(template).html();
        var template = Handlebars.compile(source);
        var html = template(obj);
        $(divtofill).html(html);
}



var deleteNotification = (terms, pLow, pHigh) => {
    var obj = {
        terms: terms,
        pLow: pLow,
        pHigh: pHigh
    }
    
    //post request to delete this notification
    $.post('/deleteNotification', obj, function(data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    })
}

var deleteFound = (link, title) => {
    console.log(email)
    var obj = {
        link: link,
        title: title,
        email: email
    }
    
    //post request to delete this notification
    $.post('/deleteFound', obj, function(data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    })
}




$(document).ready(function() {

    // logout button
    $('#logout').click(()=>{
        $.post('/logout');
        setTimeout(()=>{
            location.reload();
        }, 400);
    });

    //add notification button
    $('#submitbutton').click(()=>{
        console.log('button')
        var category2 = $('#category').val();
        var terms2 = $('#terms').val();
        var pLow2 = $('#pLow').val();
        var pHigh2 = $('#pHigh').val();
        var yrEarly2 = $('#yrEarly').val();
        var yrLate2 = $('#yrLate').val();
        var dndStart2 = $('#dndStart').val();
        var dndEnd2 = $('#dndEnd').val();

        var obj = {
            category: category2,
            terms: terms2,
            pLow: pLow2,
            pHigh: pHigh2,
            yrEarly: yrEarly2,
            yrLate: yrLate2,
            dndStart: dndStart2,
            dndEnd: dndEnd2
        }

        console.log('------------------------obj as sent from browser-----------------')
         console.log(obj);

        $.post('/addNotification', obj, function(data,status){
            console.log(data);
            console.log(status);
        })

        // $('#closeModalButton').click();
        location.reload();
    })

    // initiate user in db if not already there
    $.post('/inituser', (data) => {
        console.log(data);
    });

    // initiate clockpicker plugin
    $('.clockpicker').clockpicker();

    // populate welcomename in jumbotron
    $.get('/user', function(res){
        console.log(res)
        var n = res.givenName;
        email = res.email;
        $('#welcomename').html(n);
    });

    // fill notifications panel w users notifications setup
    $.getJSON("/notifications", function(results){
        fillit(results, '#notificationTemplate', '#notificationList')
    });

    // fill found notifications panel with previously found searches
    $.getJSON("/founds", function(results){
        fillit(results, '#foundTemplate', '#foundList')
    });

    // only allow bottom 2 fields if Car is selected
    // disable bottom 4 if free is selected

    $('#category').change(function () {
        if ($('#category').val() != 'Cars') {
            $('#yrEarly').attr('disabled', 'disabled').val('');
            $('#yrLate').attr('disabled', 'disabled').val('');
        } else {
            $('#yrEarly').removeAttr('disabled');
            $('#yrLate').removeAttr('disabled');;
        }
        
        if ($('#category').val() === 'Free Stuff') {
            $('#pLow').attr('disabled', 'disabled').val('');
            $('#pHigh').attr('disabled', 'disabled').val('');
        } else {
            $('#pLow').removeAttr('disabled');
            $('#pHigh').removeAttr('disabled');
        }
    });


})