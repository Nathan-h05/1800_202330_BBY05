function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            // method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function


// Reza w quotes gen
// Reference to the 'quotes' collection
const quotesCollection = firebase.firestore().collection('quotes');

// Get random quote
quotesCollection.get().then((querySnapshot) => {
  const quotes = [];
  querySnapshot.forEach((doc) => {
    quotes.push(doc.data().message);
  });

  // Display a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById('quote').innerHTML = `<p class="white">Quote of the day: ${randomQuote}</p>`;
  // document.getElementById("quote").innerText = randomQuote;
});