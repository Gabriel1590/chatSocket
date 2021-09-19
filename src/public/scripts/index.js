
// Listen to clicks in the headers
document.addEventListener('click', function (event) {
    event.preventDefault();
    const ele = event.target;
    if (ele.matches('#nav-users')) {
        window.location.href = '/users';
    } else if (ele.matches('#nav-chat')) {
        window.location.href = '/chat';
    } else if (ele.matches('#nav-logout')) {
        Http.Get('/api/auth/logout')
            .then(() => {
                window.location.href = '/';
            });
    }
}, false);

function toggleNavbar() {
    document.getElementsByClassName("topnav")[0].classList.toggle("responsive");
}