//initialize firebase
var config = {
    apiKey: "AIzaSyCzeQiIeIZBrN7JNRo9aE3xYYVKXLTc400",
    authDomain: "myfood-26cb7.firebaseapp.com",
    databaseURL: "https://myfood-26cb7.firebaseio.com",
    storageBucket: "myfood-26cb7.appspot.com",
    messagingSenderId: "46630304077"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var keyHolder = ""; 
  var getKey="";
  var itemQuantity ="";
  var currentDate = "";
  var expiryDate = "";
  var itemList = [];
  var items = "";
// Capture Button Click
$("#itemSubmitButton").on("click", function(event) {
  event.preventDefault();

// Capture inputs for fridge and store them into variables
  var itemName = $("#itemName").val().trim();
  var itemQuantity = $("#itemQuantity").val().trim();
  var currentDate = $("#currentDate").val().trim();
  var expiryDate = $("#expiryDate").val().trim();
  
  keyHolder = database.ref().push({
    itemName: itemName,
    itemQuantity: itemQuantity,
    currentDate: currentDate,
    expiryDate: expiryDate,       
});//end of function(event)

//Clearing iput boxes
  $("#itemName").val("");
  $("#itemQuantity").val("");
  $("#currentDate").val("");
  $("#expiryDate").val("");

});
  // database.ref().on("value", function(snapshot){
  // console.log(snapshot.val())
  // })
// Listener on firebase database
  database.ref().on("child_added", function(snapshot) {
    var tableRow = $("<tr>");
    itemName = snapshot.val().itemName;
    itemQuantity = snapshot.val().itemQuantity;
    currentDate = snapshot.val().currentDate;
    expiryDate = snapshot.val().expiryDate;

    var fridgeArray = [itemName, itemQuantity, currentDate, expiryDate];
    var ingredientsList = [itemName];

// Appending "remove" button and item keys for each row in firebase database 
  $("#ingredientsTable").append("<tr id="+snapshot.key+"><td>"+ snapshot.val().itemName +"</td>"+
                        "<td>"+ snapshot.val().itemQuantity +"</td>"+
                        "<td>"+ snapshot.val().currentDate +"</td>"+
                        "<td>"+ snapshot.val().expiryDate+"</td>"+
                        "<td class='remove'><input type='submit' value='remove' class='remove-item btn btn-primary btn-sm'>"+ 
                        "</td></tr>");
//console.log(snapshot.key);
// For loop for table
  for(var i = 0; i<fridgeArray.length; i++) {
    var tableData = $("<td>");
    tableData.text(fridgeArray[i]);   
    items = (fridgeArray[0]);    
    tableRow.append(tableData);
  };
    itemList.push(fridgeArray[0]);  
    // console.log(itemList);
   $("#itemsFridge").html("<h3>Ingredients inside your fridge: " +itemList+ "</h3>");
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code)
});


//Code that removes item row in firbase database
  $("body").on("click", ".remove-item", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     // console.log(getKey);
     database.ref(getKey).remove();
  });


//Button function for generating recipe lists with images
  function getRecipe() { 
    var items = itemList.toString(); 
    // console.log(items);
    
// ---Spoonacuar AJAX call for recipe title, macthed ingredient count and images-----   
    var output = $.ajax({
    url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?&includeIngredients="+ items+"&number=5&instructionsRequired=true", // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(data) {
      $("#output").empty();
      
        for(var i=0; i<data.results.length; i++){
            var recipeDiv = $("<div class='recipe'>");
            var title = data.results[i].title;
            var matched = data.results[i].usedIngredientCount;
            var pOne = $("<p>").text("Title: " + title);
            var pTwo = $("<p>").text("Ingredients Matched: " + matched);
            recipeDiv.append(pOne);
            recipeDiv.append(pTwo);
            var imgURL1 = data.results[i].image;
            var id = data.results[i].id;
            var image = $("<img>").attr({src:imgURL1, 
                                        "data-img":imgURL1,
                                        "height":250,
                                        "width":250,
                                        "data-ID": id,
                                        "data-name": title,
                                        "class":"jpg"});
            recipeDiv.append(image);
            $("#output").append(recipeDiv);
          }  

        // console.log(data); 
        },
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
    }
  });//-- end of fucntion getRecipe()

}
// Using Jquery UI to display transition effects - hiding and displaying images
    $("#output").on("click",".jpg", function () {
    $("#output").effect("drop");
    $("#recipe-view").effect("slide");
    $("#imagePick").html("<h3>Ingredients inside your fridge: " +items+ "</h3>");  

// Display selected recipe image
      var recipeInput = $(this).attr("data-name");
      var recipeID= $(this).attr("data-ID");
      var recipePick = $("<div id='imagePick'>");
      var image = $(this).attr("data-img");
      
    $("#imagePick").html("<img src="+image+">");
    $("#search").hide("slide");
    
    console.log(recipeInput);
    var queryURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAGlrgn7TPlpZMhX5rEXyLTPtX5boTIKA8&part=snippet&maxResults=3&type=video&videoEmbeddable=true&q=food,recipe" + recipeInput + "&alt=json";               
    var queryURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"+recipeID+"/analyzedInstructions?stepBreakdown=true";
 

 //----- Spoonacular API call for recipe instructions----
    var output = $.ajax({
    url: queryURL2,
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(recipeData) {
        $("#recipe-view").append("<h1>Instructions</h1>");
          for (var i=0; i<recipeData[0].steps.length; i++){
            var stepsView = $("<div class='stepsView'>");
            var pOne = $("<p>").text("Step "+recipeData[0].steps[i].number)
            var pTwo = $("<p>").text(recipeData[0].steps[i].step);
            stepsView.append(pOne);
            stepsView.append(pTwo);
            $("#recipe-view").append(stepsView);
            }
            // console.log(recipeData);
        },
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
    }
  });


// ----You Tube Videos-----

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
    $("#recipe-video").html("<h3>Additional Recipe Recommendations</h3><br>");

      for (i = 0; i < response.items.length; i++) {
        var videoDiv = $("<div>");
        videoDiv.attr("class", "embed-responsive embed-responsive-16by9");
        var videoTitle = response.items[i].snippet.title;
        var p = $("<p id='pVideoTitle'>").text(videoTitle);
        var videoId = response.items[i].id.videoId;
        var videoPlayer = $("<iframe>");
        videoPlayer.attr("src", "https://www.youtube.com/embed/" + response.items[i].id.videoId +"?autoplay=0");
        videoPlayer.attr("width", "500");
        videoPlayer.attr("height", "300"); 
        videoPlayer.attr("class", "embed-responsive-item"); 
        videoDiv.append(videoPlayer);
        $("#recipe-video").append(p);
        $("#recipe-video").append(videoDiv);
      } 
    });
});

//login by local storage 

$("#Signin").on("click", function(event) {
event.preventDefault();

// Capture User Inputs and store them into variables

//var userName = $("#name-input").val().trim();
var userEmail = $("#inputEmail").val().trim();
var password = $("#inputPassword").val().trim();

// Console log each of the user inputs to confirm we are receiving them correctly
 console.log(userEmail);
  console.log(password);

// Output all of the new information into the relevant HTML sections
localStorage.clear();
//localStorage.setItem("userName",userName);
localStorage.setItem("userEmail",userEmail);
localStorage.setItem("password",password);



//$("#name-display").html(localStorage.getItem("userName"));
$("#userdispay").html("Hello "+localStorage.getItem("userEmail"));


window.location.href = 'fridge.html';


});

//$("#name-display").html(localStorage.getItem("userName"));
$("#userdispay").html("Hello "+localStorage.getItem("userEmail"));

