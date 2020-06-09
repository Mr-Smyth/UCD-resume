function userInformationHTML(user) { /* Taking in the returned data */
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target ="_blank">${user.login}</a>) 
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target ="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) { // function to output the public repos of selected user
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No Repos !</div>`;
    }

    let listItemsHTML = repos.map(function (repo) { // iterate through the repos array and return <li> format below
        return `
            <li>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </li>`;
    });

    return `
        <div class="clearfix repo-list">
            <p>
                <strong>Repo List:</strong>
            </p>
            <ul>
                ${listItemsHTML.join("\n")}
            </ul>
        </div>`; // use the join() method on that array and join everything with a new line. Means we dont have to iterate through the array


}


function fetchGitHubInformation(event) {  // Main function to get github API data

    // to deal with old user data being left on screen, this clears it off
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    let username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a valid GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(`
        <div id="loader">
            <img src="assets/css/loader.gif" alt="loading . . ." />
        </div>`);

    // Get data 
    $.when(
        $.getJSON(`https://cors-anywhere.herokuapp.com/api.github.com/users/${username}`),
        $.getJSON(`https://cors-anywhere.herokuapp.com/api.github.com/users/${username}/repos`)
    ).then(
        function (firstResponse, secondResponse) { /* when we do two calls like this, the when() method packs a response up into arrays.
                                                        And each one is the first element of the array.
                                                    So we just need to put the indexes in there for these responses. */
            let userData = firstResponse[0];
            let repoData = secondResponse[0];

            $("#gh-user-data").html(userInformationHTML(userData)); // set html to the results of the userInformationHTML function, with userData sent as the argument
            $("#gh-repo-data").html(repoInformationHTML(repoData));

        }, function (errorResponse) {
            if (errorResponse === 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) { // to handle throttling on github
                let resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000); /* unix timestamp is stored within this header(x-rateLimit-reset) we multiply unix time stamp by 1000 to convert to miliseconds for js to handle */
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`); /* toLocaleDateString picks up your location from your browser and prints the local calculated time that the service can be used again. */
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`)
            }
        });

}