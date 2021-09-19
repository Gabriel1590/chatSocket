/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();


function displayUsers() {
    Http.Get('/api/users/all')
        .then(response => response.json())
        .then((response) => {
            var allUsers = response.users;
            // Empty the anchor
            var allUsersAnchor = document.getElementById('users-container');
            allUsersAnchor.innerHTML = '';
            // Append users to anchor
            allUsers.forEach((user) => {
                allUsersAnchor.innerHTML += getUserDisplayEle(user);
            });
        });
};


function getUserDisplayEle(user) {
    return `<div class="card">
        <div class='user-display-ele'>
            <div class='normal-view'>
                <div>Name: ${user.name}</div>
                <div>Email: ${user.email}</div>
            </div>
        </div>
    </div>`;
}
