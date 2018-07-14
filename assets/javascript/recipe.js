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

var itemList = [];
var items = "";
var recipeTitle = "";

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

// <<<<<< function for generating recipe lists with images >>>>>>
function getRecipe() { 
	var items = itemList.toString(); 
	// Spoonacular AJAX call for recipe title, matched ingredient count and images-----   
	var output = $.ajax({
	  url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?&includeIngredients=" + items + "&number=5&instructionsRequired=true", // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
	  type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
	  data: {}, // Additional parameters here
	  dataType: 'json',
	  success: function(data) {
	    
      $("#resultsDiv").empty();
      $("#recipePanelTitle").empty();
      $("#recipePanelTitle").append("RECIPES");
      
      createRecipesHTML(data);
 
    },
	  error: function(err) { console.log(err); },
	  beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
	  }
	});
}
// ^^^^^^ END getRecipe() function ^^^^^^


// <<<<<< BEGIN on click event when clicking food image >>>>>>
$("#resultsDiv").on("click",".jpg", function () {

  $("#recipePanelTitle").empty();
  $("#resultsDiv").empty();
  $("#recipePanelTitle").append("RECIPE INSTRUCTIONS");

  var recipeID = $(this).attr("data-ID");
  recipeTitle = $(this).attr("data-title");
  var recipeImage = $(this).attr("src");         

  // Spoonacular API call for recipe instructions
  var output = $.ajax({
    url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/analyzedInstructions?stepBreakdown=true",
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(recipeData) {

      createChosenRecipeHTML(recipeData);

      $("#chosenRecipeImage").attr("src", recipeImage);
      $("#chosenRecipeTitle").append(recipeTitle);
      $(".img-responsive").removeClass("jpg");

    },
    error: function(err) { console.log(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
    }
  });

});// ^^^^^^ END on click event clicking food image ^^^^^^

// <<<<<< BEGIN button click for videos >>>>>>
$(".panel-body").on("click", "#videosButton", function () {
  
  $.ajax({
    url: "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAGlrgn7TPlpZMhX5rEXyLTPtX5boTIKA8&part=snippet&maxResults=3&type=video&videoEmbeddable=true&q=food,recipe" + recipeTitle + "&alt=json",
    method: "GET"
  }).done(function(response) {

    $("#modalVideoOne").attr("src", "https://www.youtube.com/embed/" + response.items[0].id.videoId +"?autoplay=0");
    $("#modalVideoTwo").attr("src", "https://www.youtube.com/embed/" + response.items[1].id.videoId +"?autoplay=0");

    $('#myModal').modal();

  }); 

});
//  ^^^^^^ END button click for videos ^^^^^^
  

// <<<<<< BEGIN realtime database listener >>>>>>
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    window.setTimeout(function () {
        getRecipe();
    }, 1000);

    // get user name and put in profile
    $("#userName").append(user.displayName);

    // get the fridge item name data from the database
  	var fridgeRef = firebase.database().ref('users/' + user.uid + '/fridge');
    fridgeRef.on('child_added', function(snapshot) {
    	itemName = snapshot.val().itemName;
      // put it in list div
      $("#fridgeItems").append("<h3>" + itemName.toUpperCase() + "</h3>");
    	itemList.push(itemName);
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
// ^^^^^^ END realtime database listener ^^^^^^


// function for handlebars template recipes
function createRecipesHTML(recipesData) {
  var source = document.getElementById("recipes-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(recipesData);

  var recipesDiv = document.getElementById("resultsDiv");
  recipesDiv.innerHTML = html;
}

// function for handlebars template one chosen recipe
function createChosenRecipeHTML(recipeData) {
  var source = document.getElementById("chosenRecipe-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(recipeData);

  var recipeInstructionDiv = document.getElementById("resultsDiv");
  recipeInstructionDiv.innerHTML = html;
}



