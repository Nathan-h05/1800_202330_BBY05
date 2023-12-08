var currentUser;              
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;
                    var userEmail = userDoc.data().email;
                    var userCountry = userDoc.data().country;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false; 
}

function saveUserInfo() {

    userName = document.getElementById('nameInput').value;      
    userSchool = document.getElementById('schoolInput').value;   
    userCity = document.getElementById('cityInput').value;       
    userEmail = document.getElementById('emailInput').value; 
    userCountry = document.getElementById('countryInput').value;

    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        email: userEmail,
        country: userCountry
    })
        .then(() => {
            console.log("Document successfully updated!");
            window.location.href = "main.html";
        })
    document.getElementById('personalInfoFields').disabled = true;
}

function logout() {
    firebase.auth().signOut();
    window.location.href = "index.html";
}
