$(document).ready(function() {

	// 1. Initialize Firebase
    var config = {
        apiKey: "AIzaSyBTm_t7rFmL3bR5niUCGmJMzSuygJ-3xX4",
        authDomain: "test-project-1618a.firebaseapp.com",
        databaseURL: "https://test-project-1618a.firebaseio.com",
        projectId: "test-project-1618a",
        storageBucket: "test-project-1618a.appspot.com",
        messagingSenderId: "807092599447"
      };
      firebase.initializeApp(config);


  var database = firebase.database();


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
  		database.ref().push(newbill);

	
	  $("#bill-name-input").val("");
	  $("#cost-input").val("");
      $("#month-input").val("");
      $("#day-input").val("");
      $("#year-input").val("");
  	});

  
	database.ref().on("child_added", function(childSnapshot) {

	  console.log(childSnapshot.val());

	  var billName = childSnapshot.val().name;
	  var cost = childSnapshot.val().totalcost;
      var monthdate = childSnapshot.val().start;
      var daydate = childSnapshot.val().start1;
      var yeardate = childSnapshot.val().start2;
      
      $('tbody').append("<tr><td>" + billName 
        + "</td><td>" + "$" + cost +"</td><td>" + monthdate + "/"+ daydate + "/" + yeardate
        +"</td><td>$" + parseInt(cost)/4 +
       "</td><td><button class='btn btn-outline-danger paid'>Paid</button></td></tr>");
    

    	});
    $(document).on("click", ".paid", function(){
        $(this).removeClass("btn-outline-danger").addClass("btn-success")
    })

});
