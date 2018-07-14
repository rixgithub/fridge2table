// Initialize Firebase
var config = {
  apiKey: "AIzaSyDHpZ23350ysBlfjEpHUXr3-ciy04qmflE",
  authDomain: "fridgerecipe-c3343.firebaseapp.com",
  databaseURL: "https://fridgerecipe-c3343.firebaseio.com",
  projectId: "fridgerecipe-c3343",
  storageBucket: "fridgerecipe-c3343.appspot.com",
  messagingSenderId: "1082956784780"
};
firebase.initializeApp(config);

var database = firebase.database();

var keyHolder = ""; 
var getKey = "";
var itemList = [];
var items = "";

// <<<<<< BEGIN log out event >>>>>>
$("#btnLogout").on("click", function(event) {
  firebase.auth().signOut().then(function() {
    window.location = "../views/index.html";
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});
// ^^^^^^ END log out event ^^^^^^

// *********** BEGIN Add Item to the fridge ********
$("#itemSubmitButton").on("click", function(event) {
  event.preventDefault();

  // Capture inputs for fridge and store them into variables
  var itemName = $("#inputItemName").val().trim();
  var itemQuantity = $("#inputItemQuantity").val().trim();
  var currentDate = new Date();
    var dd = currentDate.getDate();
    var mm = currentDate.getMonth()+1; 
    var yyyy = currentDate.getFullYear();
      if (dd < 10) {
          dd = '0'+ dd;
      } 

      if (mm < 10) {
          mm = '0' + mm;
      } 
      currentDate = yyyy + '-' + mm + '-' + dd;
  var expirationDate = $("#inputExpirationDate").val().trim();
  
  // ****  Adding items to database ****
  // get the current user
  let user = firebase.auth().currentUser;

  firebase.database().ref('users/' + user.uid + '/fridge').push({
    itemName: itemName,
    itemQuantity: itemQuantity,
    currentDate: currentDate,
    expirationDate: expirationDate
  });

  //Clearing input boxes in the form
  $("#inputItemName").val("");
  $("#inputItemQuantity").val("");
  $("#inputExpirationDate").val("");

});
// ^^^^^^^^ END of itemSubmitButton (button click event) ^^^^^^^^

// // ************ BEGIN realtime database listener ************
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

  	$("#userName").append(user.displayName);

    var fridgeRef = firebase.database().ref('users/' + user.uid + '/fridge');
    fridgeRef.on('child_added', function(snapshot) {
  		var tableRow = $("<tr>");
  		itemName = snapshot.val().itemName;
  		itemQuantity = snapshot.val().itemQuantity;
  		currentDate = snapshot.val().currentDate;
  		expirationDate = snapshot.val().expirationDate;

  		var fridgeArray = [itemName, itemQuantity, currentDate, expirationDate];
  		var ingredientsList = [itemName];

  		// Appending "remove" button and item keys for each row in firebase database 
  		$("#ingredientsTable").append("<tr id="+snapshot.key+"><td>"+ snapshot.val().itemName +"</td>"+
  		    "<td>"+ snapshot.val().itemQuantity +"</td>"+
  		    "<td>"+ snapshot.val().currentDate +"</td>"+
  		    "<td>"+ snapshot.val().expirationDate +"</td>"+
  		    "<td class='remove'><input type='submit' value='REMOVE' class='remove-item btn btn-warning btn-sm'>"+ 
  		    "</td></tr>");

  		// For loop for table
  		for(var i = 0; i<fridgeArray.length; i++) {
  			var tableData = $("<td>");
  			tableData.text(fridgeArray[i]);   
  			items = (fridgeArray[0]);    
  			tableRow.append(tableData);
  		};
		  
		  itemList.push(fridgeArray[0]);  

  			//Code that removes item row in firebase database
  		$("body").on("click", ".remove-item", function(){
  			var getKey = "";
  		    $(this).closest('tr').remove();
  		    getKey = $(this).parent().parent().attr('id');
  		    database.ref('users/' + user.uid + '/fridge/' + getKey).remove();
		  });
	  });

     // Spoonacular API call for food trivia
    var output = $.ajax({
      url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/trivia/random",
      type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
      data: {}, // Additional parameters here
      dataType: 'json',
      success: function(triviaData) {

        $("#foodTrivia").append(triviaData.text);

      },
      error: function(err) { console.log(err); },
      beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
      }
    });


  } else {
    console.log("No user is logged in.");
    window.location = "../views/index.html";
  }
});
// ^^^^^^^^ END of realtime database listener ^^^^^^^^^^

