$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBOxWehNLh4ebOfHGu93OkBhbgQs3cNBeo",
    authDomain: "project1database-eda98.firebaseapp.com",
    databaseURL: "https://project1database-eda98.firebaseio.com",
    projectId: "project1database-eda98",
    storageBucket: "project1database-eda98.appspot.com",
    messagingSenderId: "706535478057"
};
firebase.initializeApp(config);


  var database = firebase.database();
  var billref = database.ref("/billref")
  var userref = database.ref("/userData")
  var noUsers = 0;


  userref.on("child_added", function(snapshot) {
      noUsers = noUsers + 1;
  })

  $("#add-bill-btn").on("click", function(event) {
  		event.preventDefault();

	  var billName = $("#bill-name-input").val().trim();
	  var cost = $("#cost-input").val().trim();
      var monthdate = $("#month-input").val().trim();
      var daydate = $("#day-input").val().trim();
      var yeardate = $("#year-input").val().trim();
      var ispaid = false;
	


	  var newbill = {
	  	name: billName,
	  	totalcost:  cost,
        start: monthdate,
        start1: daydate,
        start2: yeardate,
        paid:  ispaid,
	  };
  		billref.push(newbill);

	
	  $("#bill-name-input").val("");
	  $("#cost-input").val("");
      $("#month-input").val("");
      $("#day-input").val("");
      $("#year-input").val("");
  	});

  
	billref.on("child_added", function(childSnapshot) {

	  console.log(childSnapshot.val());

	  var billName = childSnapshot.val().name;
	  var cost = childSnapshot.val().totalcost;
      var monthdate = childSnapshot.val().start;
      var daydate = childSnapshot.val().start1;
      var yeardate = childSnapshot.val().start2;
      
      $('tbody').append("<tr><td>" + billName 
        + "</td><td>" + "$" + cost +"</td><td>" + monthdate + "/"+ daydate + "/" + yeardate
        +"</td><td>$" + parseInt(cost)/noUsers +
       "</td><td><button class='btn btn-outline-danger paid'>Paid</button></td></tr>");
    

    	});
    $(document).on("click", ".paid", function(){
        $(this).removeClass("btn-outline-danger").addClass("btn-success")
    })

});
