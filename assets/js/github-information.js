function fetchGitHubInformation(event) {
    let username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a valid GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(`
        <div id="loader">
            <img src="assets/css/loader.gif" alt="loading . . ." />
        </div>`);


    $.when(
        $.getJSON(`https://api.github.com/users/${username}`)
    ).then(
       function(response) {
           let userData = response;
           $("#gh-user-data").html(userInformationHTML(userData)) // set html to the results of the userInformationHTML function, with userData sent as the argument

       }, function(errorResponse) {
           if (errorResponse === 404) {
               $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
           } else {
               console.log(errorResponse);
               $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`)
           }
       });

}