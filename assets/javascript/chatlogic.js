// var config = {
//     apiKey: "AIzaSyBOxWehNLh4ebOfHGu93OkBhbgQs3cNBeo",
//     authDomain: "project1chatref-eda98.firebaseapp.com",
//     chatrefURL: "https://project1chatref-eda98.firebaseio.com",
//     projectId: "project1chatref-eda98",
//     storageBucket: "project1chatref-eda98.appspot.com",
//     messagingSenderId: "706535478057"
// };

//firebase.initializeApp(config);

var database = firebase.database();

var currentTime = moment();
var time = moment(currentTime).format("hh:mm");
var date = moment().format("MM/DD/YY");
var username = localStorage.email;

var chatref = database.ref("/chatdata");





$(document).ready(function () {

   

    $("#displayUser").text(localStorage.email);

    $("#submit").on("click", function (event) {
        event.preventDefault();
        var message = $("#textbox").val().trim();

        var currentMoment = moment();
        var timeStamp = moment(currentMoment).format("hh:mm");
        var dateToday = moment(currentMoment).format("MM/DD/YY");


        var chatUpload = {
            comment: message,
            time: timeStamp,
            user: username,
            date: dateToday
        };

        chatref.ref().push(chatUpload);
        console.log(chatUpload.comment);
        console.log("time: " + chatUpload.time);
        console.log("date:" + chatUpload.date);

        $("#textbox").val("");

    });

    chatref.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        var commentGrab = childSnapshot.val().comment;
        var timeGrab = childSnapshot.val().time;
        var userGrab = childSnapshot.val().user;
        var dateGrab = childSnapshot.val().date;
        console.log(commentGrab);



        $("#messages").prepend("<b>" + userGrab + "</b>" + ": " + "<i> " + timeGrab + "     " + dateGrab + " </i>" + "<br>" + commentGrab + "<br>");
    })


    $("#loginbtn").on("click", function (event) {
        event.preventDefault();
        var email = $("#exampleInputEmail1").val();
        var password = $("#password").val();

        if (email === "ryan@gmail.com" && password === "ryan" || email === "eric@gmail.com" && password === "eric" || email === "sean@gmail.com" && password === "sean" || email === "khalid@gmail.com" && password === "khalid") {
            localStorage.setItem("email", email);
            $("#displayUser").text(localStorage.email);
            $("#exampleInputEmail1").val("");
            $("#password").val("");
        } else {
            $("#exampleInputEmail1").val("");
            $("#password").val("");
            alert("wrong username");
        }




    })



});

