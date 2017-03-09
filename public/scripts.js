function logout(){
    $.ajax({
        url: '/users/logout',
        type: "GET",
        async: false,
        success: function(){
            window.location.reload();
        }
    });
};

function changeUsername(){
    var retVal = confirm("Do you want to change your username?");
    var input = (document.getElementById("theUsername").value).toString();
    var input2  = {data: input};
    if( retVal == true ) {
        $.ajax({
            url: '/changeUsername',
            type: "POST",
            async: false,
            dataType: "json",
            data: input2,
            success: function (data) {
                console.log(data);
                if (data.message.toString() == 'failed')
                    alert('Failed to change Username');
                window.location.reload();
            }
        });
    }
};