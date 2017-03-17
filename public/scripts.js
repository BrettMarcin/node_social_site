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

function settings(){
    $.ajax({
        url: '/users/settings',
        type: "GET",
        async: false,
        success: function(){
            window.location.reload();
        }
    });
}

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
                if (data.message.toString() == 'failed')
                    alert('Failed to change Username');
                window.location.reload();
            }
        });
    }
};

function changePassword(){
    var retVal = confirm("Are you sure you want to change your password?");
    var input = (document.getElementById("password1").value).toString();
    var input3 = (document.getElementById("password2").value).toString();
    var input2  = {data: input};
    if(input != input3){
        alert('The passwords do not match');
        return;
    }
    if( retVal == true ) {
        $.ajax({
            url: '/changePassword',
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

function removePost(data){
    var retVal = confirm("Are you sure you want to delete this post?");
    var input  = {theData: data};
    if( retVal == true ) {
        $.ajax({
            url: '/users/removePost',
            type: "POST",
            async: false,
            dataType: "json",
            data: input,
            success: function (data) {
                window.location.reload();
            }
        });
    }
}

function unFollowUser(profileUser){

}

function followUser(profileUser){
    var input  = {profileUser: profileUser};
        $.ajax({
            url: '/users/followUser',
            type: "POST",
            async: false,
            dataType: "json",
            data: input,
            success: function (data) {
                window.location.reload();
            }
        });
}

function unfollowUser(profileUser){
    var input  = {profileUser: profileUser};
    $.ajax({
        url: '/users/unfollowUser',
        type: "POST",
        async: false,
        dataType: "json",
        data: input,
        success: function (data) {
            window.location.reload();
        }
    });
}