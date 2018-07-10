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

// // ***************************************************
// // ******* Begin Firebase Authentication ***************
// // ***************************************************

// // <<<<<<<<<< login event >>>>>>>>>>>>>>
// $("#btnLogin").on("click", function(event) {
//   event.preventDefault();
  
//   // get email and password
//   const email = $("#loginEmail").val().trim();
//   const pass = $("#loginPassword").val().trim();
  
//   // login
//   firebase.auth().signInWithEmailAndPassword(email, pass).then(function() {
//     // go to the fridge page after logging in
//     window.location = "../views/fridge.html";
//   })
//   .catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorCode);
//     console.log(errorMessage);
//   });
// });// <<<<<<<< end login event >>>>>>>>>>>>

// // <<<<<<<<<<<< signup event >>>>>>>>>>>>>>>
// $("#btnSignup").on("click", function(event) {
//   event.preventDefault();
  
//   // get email, password and name from signup form
//   let displayName = $("#signupName").val().trim();
//   let email = $("#signupEmail").val().trim();
//   let pass = $("#signupPassword").val().trim();
  
//   // sign up
//   firebase.auth().createUserWithEmailAndPassword(email, pass)
//   .then(function() {
    
//     // get current user
//     let user = firebase.auth().currentUser;
    
//     // update the name to profile
//     user.updateProfile({
//       displayName: displayName
//     });

//     // when creating new account store member info into database
//     firebase.database().ref('users/' + user.uid).set({
//       name: displayName,
//       email: email,
//       fridge: 0
//     });
  
//     // go to the fridge page after signing up
//     window.location = "../views/fridge.html";
//   })
//   .catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorCode);
//     console.log(errorMessage);
//   });
// });// <<<<<<<<< end signup event >>>>>>>>>

//  // <<<<<<<<<<<< log out event >>>>>>>>>>>>
// $("#btnLogout").on("click", function(event) {
//   firebase.auth().signOut().then(function() {
//     console.log("Sign-out successful.");
//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorCode);
//     console.log(errorMessage);
//   });
// });// <<<<<<<<<<<< end log out event >>>>>>>>>>>>

// // realtime database listener
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log("User logged in.");
//     console.log(user);
//   } else {
//     console.log("No user is logged in.");
//   }
// });

// // ***************************************************
// // ******* End Firebase Authentication ***************
// // ***************************************************


// // *********** Adding an Item to the fridge ********
// $("#itemSubmitButton").on("click", function(event) {
//   event.preventDefault();

//   // Capture inputs for fridge and store them into variables
//   var itemName = $("#inputItemName").val().trim();
//   var itemQuantity = $("#inputItemQuantity").val().trim();
//   var currentDate = new Date();
//     var dd = currentDate.getDate();
//     var mm = currentDate.getMonth()+1; 
//     var yyyy = currentDate.getFullYear();
//       if (dd < 10) {
//           dd = '0'+ dd;
//       } 

//       if (mm < 10) {
//           mm = '0' + mm;
//       } 
//       currentDate = yyyy + '-' + mm + '-' + dd;
//   var expirationDate = $("#inputExpirationDate").val().trim();
  
//   // ****  Adding items to database ****
//   // get the current user
//   let user = firebase.auth().currentUser;

//   firebase.database().ref('users/' + user.uid + '/fridge').push({
//     itemName: itemName,
//     itemQuantity: itemQuantity,
//     currentDate: currentDate,
//     expirationDate: expirationDate
//   });

//   //Clearing input boxes in the form
//   $("#inputItemName").val("");
//   $("#inputItemQuantity").val("");
//   $("#inputExpirationDate").val("");

// });//end of itemSubmitButton( button click event)

// ********* realtime database listener *********
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
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
            "<td class='remove'><input type='submit' value='Remove' class='remove-item btn btn-danger btn-sm'>"+ 
            "</td></tr>");

      // For loop for table
      for(var i = 0; i<fridgeArray.length; i++) {
        var tableData = $("<td>");
        tableData.text(fridgeArray[i]);   
        items = (fridgeArray[0]);    
        tableRow.append(tableData);
      };
      
      itemList.push(fridgeArray[0]);  
      $("#itemsFridge").html("<h3>Ingredients inside your fridge: " +itemList+ "</h3>");

      //Code that removes item row in firebase database
      $("body").on("click", ".remove-item", function(){
          $(this).closest('tr').remove();
          getKey = $(this).parent().parent().attr('id');
          database.ref('users/' + user.uid + '/fridge/' + getKey).remove();
      });
      
    });
  } else {
    console.log("No user is logged in.");
  }
});// end of realtime database listener

// //Button function for generating recipe lists with images
//   function getRecipe() { 
//     var items = itemList.toString();     
//     //Spoonacular AJAX call for recipe title, matched ingredient count and images-----   
//     var output = $.ajax({
//       url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?&includeIngredients=" + items + "&number=5&instructionsRequired=true", // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
//       type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
//       data: {}, // Additional parameters here
//       dataType: 'json',
//       success: function(data) {
//         $("#output").empty();
        
//           for(var i=0; i<data.results.length; i++){
//               var recipeDiv = $("<div class='recipe'>");
//               var title = data.results[i].title;
//               var matched = data.results[i].usedIngredientCount;
//               var pOne = $("<p>").text("Title: " + title);
//               var pTwo = $("<p>").text("Ingredients Matched: " + matched);
//               recipeDiv.append(pOne);
//               recipeDiv.append(pTwo);
//               var imgURL1 = data.results[i].image;
//               var id = data.results[i].id;
//               var image = $("<img>").attr({src:imgURL1, 
//                                           "data-img":imgURL1,
//                                           "height":250,
//                                           "width":250,
//                                           "data-ID": id,
//                                           "data-name": title,
//                                           "class":"jpg"});
//               recipeDiv.append(image);
//               $("#output").append(recipeDiv);
//             }  
//           },
//       error: function(err) { alert(err); },
//       beforeSend: function(xhr) {
//       xhr.setRequestHeader("X-Mashape-Authorization", "UjeKODDd3umshkg8ScHkWRx8aQW7p1Cj6eYjsn4NOz1U399GXM"); // Enter here your Mashape key
//       }
//     });
//   }//-- end of getRecipe function


  // on click event when clicking food image
  $("#output").on("click",".jpg", function () {
    // Using Jquery UI to display transition effects - hiding and displaying images
      $("#output").effect("drop");
      $("#recipe-view").effect("slide");
      $("#imagePic").html("<h3>Ingredients inside your fridge: " +items+ "</h3>");  

      // Display selected recipe image
        var recipeInput = $(this).attr("data-name");
        var recipeID = $(this).attr("data-ID");
        var recipePic = $("<div id='imagePic'>");
        var image = $(this).attr("data-img");
        
      $("#imagePic").html("<img src="+image+">");
      $("#search").hide("slide");
      
      console.log(recipeInput);
      var queryURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAGlrgn7TPlpZMhX5rEXyLTPtX5boTIKA8&part=snippet&maxResults=3&type=video&videoEmbeddable=true&q=food,recipe" + recipeInput + "&alt=json";               
      var queryURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/analyzedInstructions?stepBreakdown=true";
   

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
      // ----You Tube Videos-----
  });
