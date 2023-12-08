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
  document.getElementById('quote').innerHTML = `<p>Safety Quote: ${randomQuote}</p>`;
});
