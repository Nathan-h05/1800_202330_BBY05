// If user is not signed in, they'll be redirected to the index landing page.
// Redirects on all pages but index and login
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = "index.html";
    }
});