//If user is not signed in and tries to access main pages, they'll be redirected
//to the index landing page.
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = "index.html";
    }
});