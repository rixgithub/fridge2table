// Initialize Firebase
const config = {
  apiKey: "AIzaSyDHpZ23350ysBlfjEpHUXr3-ciy04qmflE",
  authDomain: "fridgerecipe-c3343.firebaseapp.com",
  databaseURL: "https://fridgerecipe-c3343.firebaseio.com",
  projectId: "fridgerecipe-c3343",
  storageBucket: "fridgerecipe-c3343.appspot.com",
  messagingSenderId: "1082956784780"
};
firebase.initializeApp(config);

let database = firebase.database();

// <<<<<< BEGIN login event >>>>>>
$("#btnLogin").on("click", function(event) {
  event.preventDefault();
  
  // get email and password
  let email = $("#loginEmail").val().trim();
  let pass = $("#loginPassword").val().trim();
  
  // login
  firebase.auth().signInWithEmailAndPassword(email, pass)
  .catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
  });

  //Clearing input boxes in the form
  $("#loginEmail").val("");
  $("#loginPassword").val("");

});
// ^^^^^^ END login event ^^^^^^

// <<<<<< BEGIN signup event >>>>>>
$("#btnSignup").on("click", function(event) {
  event.preventDefault();
  
  // get email, password and name from signup form
  let displayName = $("#signupName").val().trim();
  let email = $("#signupEmail").val().trim();
  let pass = $("#signupPassword").val().trim();
  
  // sign up
  firebase.auth().createUserWithEmailAndPassword(email, pass)
  .then(function() {
    
    // get current user
    let user = firebase.auth().currentUser;
    
    // update the name to profile
    user.updateProfile({
      displayName: displayName
    });

    // when creating new account store member info into database
    firebase.database().ref('users/' + user.uid).set({
      name: displayName,
      email: email,
      fridge: 0
    });  

    // update the name to profile
    user.updateProfile({
      displayName: displayName
    });

  })
  .catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
  });

  //Clearing input boxes in the form
  $("#signupName").val("");
  $("#signupEmail").val("");
  $("#signupPassword").val("");

});
// ^^^^^^ END signup event ^^^^^^

// <<<<<< BEGIN realtime database listener >>>>>>
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // after sign up or login go to fridge page
    window.setTimeout(function () {
        location.href = "../views/fridge.html";
    }, 1000);
  } else {
    console.log("No user is logged in.");
  }
});
// ^^^^^^ END realtime database listener ^^^^^^

