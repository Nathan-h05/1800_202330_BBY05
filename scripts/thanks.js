// Redirects to post library
function goToLibrary(){
    window.location.href = "postsLibrary.html"
    
}

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            console.log(user.uid); 
            console.log(user.displayName);
            userName = user.displayName;
            document.getElementById("name-goes-here").innerText = userName; 
        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth();