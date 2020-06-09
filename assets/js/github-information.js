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

    let listItemsHTML = repos.map(function(repo) { // iterate through the repos array and return <li> format below
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
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
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
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`)
            }
        });

}