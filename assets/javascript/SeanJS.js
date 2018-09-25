$(document).ready(function () {

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


    userref.on("child_added", function (snapshot) {
        noUsers = noUsers + 1;
    })

    $("#add-bill-btn").on("click", function (event) {
        event.preventDefault();

        var billName = $("#bill-name-input").val().trim();
        var cost = $("#cost-input").val().trim();
        var monthdate = $("#month-input").val().trim();
        var daydate = $("#day-input").val().trim();
        var yeardate = $("#year-input").val().trim();
        var ispaid = false;
        var paidstate = "false";



        var newbill = {
            name: billName,
            totalcost: cost,
            start: monthdate,
            start1: daydate,
            start2: yeardate,
            paidstate: paidstate,
        };
        billref.push(newbill);


        $("#bill-name-input").val("");
        $("#cost-input").val("");
        $("#month-input").val("");
        $("#day-input").val("");
        $("#year-input").val("");
    });


    billref.on("child_added", function (childSnapshot) {

        console.log(childSnapshot.val());

        var billName = childSnapshot.val().name;
        var cost = childSnapshot.val().totalcost;
        var monthdate = childSnapshot.val().start;
        var daydate = childSnapshot.val().start1;
        var yeardate = childSnapshot.val().start2;
        var paidstate = childSnapshot.val().paidstate;
        console.log(paidstate);
        var newbutton = $("<span>")
        newbutton.text("Paid")
        newbutton.addClass("paid")
        if (paidstate === "false") {
            newbutton.attr("data-val", "false")
            newbutton.addClass("btn")
            newbutton.addClass("btn-outline-danger")
            console.log("false state")
        } else if (paidstate === "true") {
            newbutton.attr("data-val", "true")
            newbutton.addClass("btn")
            newbutton.addClass("btn-success")

        }
        console.log(newbutton)
        var usercost = parseInt(cost) / noUsers;

        var tr = $('<tr>');
        tr.append('<td>' + billName + '</td>');
        tr.append('<td>' + cost + "</td>")
        tr.append('<td>' + monthdate + "/" + daydate + "/" + yeardate + '</td>');
        tr.append('<td>' + usercost + '</td>');
        tr.append(newbutton);


        $('tbody').append(tr);
        //    <button val='false' id = 'paid' class='btn btn-outline-danger'>Paid</button>

    });
    $(document).on("click", ".paid", function () {
        var checkpaid;
        checkpaid = $(this).attr("data-val")
        console.log(checkpaid)
        if (checkpaid === "false") {
            $(this).removeClass("btn-outline-danger").addClass("btn-success")
            $(this).val("true")
        } else {
            $(this).removeClass("btn-success").addClass("btn-outline-danger")
            $(this).val("false")
        }

    })

});
