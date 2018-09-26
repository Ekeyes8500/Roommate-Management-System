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


//Variables
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//firebase reference variables first
var database = firebase.database();
var userRef = database.ref("/userData");
var eventRef = database.ref("/eventdata");

//event array that contains event objects for calendar script
var events = [];
var settings = {};

//Global trackers for new events (to allow to be called outside of that function)
var globalDay;
var globalMonth;
var globalYear;
var globalEvent;
var holidayDay;
var holidayMonth;
var holidayYear;
var holidayName;
var holidayLink;
var holidayDate;

var dayselect = $("<select>")
var monthselect = $("<select>")
var typemenu = $("<select>");
var accessmenu = $("<select>");
var pricemenu = $("<select>");
var peoplemenu = $("<select>");
var generatebtn = $("<span>");

var userTotal;
var cancelstate = false;
var users = []
var activities = ["-Type of Activities-", "Education", "Busywork", "Relaxation", "Music", "Cooking", "Charity", "D.I.Y.", "Recreational", "Social"]
var accessibility = [];
var people = [];

//chat variables--------------------------------------------------------------------------------------------------
var currentTime = moment();
var time = moment(currentTime).format("hh:mm");
var date = moment().format("MM/DD/YY");
var username = localStorage.email;

var chatref = database.ref("/chatdata");
//-------------------------------------------------------------------------------------------------------------------------

//Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//creates a numbered array for the select maker(for days, months, ect) based on 3 arguments x = how many numbers are needed 
//y = array that will have the stored numbers, z = header option name
function numberedlistmaker(x, y, z){
    y.push(z);
    for (i = 0; i < x; i++){
        if (i === 0){

        }else{
            y.push(i);
        }
    }  
}

//creates a select menu based on 3 arguments, x = array given, y = how many options(including first header one), 
//z = jquery object that will be modified
function selectmaker(x, y, z){
    var newselect = "<select>"
    var newvalue;

    for (i = 0; i < y; i++){
        newselect = newselect + "<option value="
        newvalue = x[i];
        if (i === 0){
            newvalue = ""
        }
        newselect = newselect + newvalue;
        newselect = newselect + ">"
        newselect = newselect + x[i];
        newselect = newselect + "</option>"
    }
    newselect = newselect + "</select>"
    $(z).html(newselect);
}

//Script
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
   $("#displayUser").text(username)

    //Ryan's chat code, separated  for clarity) -----------------------------------------------------------------------------

    $("#submit").on("click", function (event) {
        event.preventDefault();
        var message = $("#textbox").val().trim();
        if (message !== ""){
            var currentMoment = moment();
            var timeStamp = moment(currentMoment).format("hh:mm");
            var dateToday = moment(currentMoment).format("MM/DD/YY");
    
    
            var chatUpload = {
                comment: message,
                time: timeStamp,
                user: username,
                date: dateToday
            };
    
            chatref.push(chatUpload);
            console.log(chatUpload.comment);
            console.log("time: " + chatUpload.time);
            console.log("date:" + chatUpload.date);
    
            $("#textbox").val("");
        }
    });

    chatref.on("child_added", function (childSnapshot) {
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
    //(end chat code)--------------------------------------------------------------------------------------------------------------------

    //Sets up the expandable menu for the randomizer
    $(typemenu).attr('id', 'typemenu');
    selectmaker(activities, activities.length, typemenu);
    $(accessmenu).attr("id", "accessmenu");
    numberedlistmaker(11, accessibility, "-Difficulty-");
    selectmaker(accessibility, accessibility.length, accessmenu);
    $(pricemenu).attr("id", 'pricemenu');
    $(pricemenu).html("<select> <option value=''>-Free?-</option> <option value='0'>Yes</option> <option value ='1'>No</option> </select>");
    $(peoplemenu).attr('id', 'peoplemenu');
    numberedlistmaker(5, people, "-# of People-");
    selectmaker(people, people.length, peoplemenu);
    $(generatebtn).addClass("btn");
    $(generatebtn).addClass("btn-primary")
    $(generatebtn).text("Generate")
    $(generatebtn).attr('id', 'generate');
   
    //first API call is for holidays
    var queryURL = "https://holidayapi.com/v1/holidays?key=f09477e5-ca05-4a63-b5c1-7a78ddeec310&country=US&year=2018&month=08"
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //checks number of events loaded, and then proceeds to loop through and add them to the calendar
        var looper = response.holidays.length;
        for (i = 0; i < looper; i++) {
            holidayName = response.holidays[0].name;
            holidayDate = response.holidays[0].date;
            holidayYear = holidayDate.substr(0, 4)
            holidayMonth = holidayDate.substr(5, 2)
            holidayDay = holidayDate.substr(8, 2)
            var holidayEvent = { 'Date': new Date(holidayYear, holidayMonth - 1, holidayDay), 'Title': holidayName, 'Link': 'https://en.wikipedia.org/wiki/' + holidayName };
            events.push(holidayEvent)

        }

    })


    //URL for weather API currently rigged for philadelphia, would be based on location if we had money to spend on APIs... we don't
    var weatherqueryURL = "https://api.weatherbit.io/v2.0/current?key=847f4ebbc36b477c8901fab6bc2b59fa&units=i&city=philadelphia";

    $.ajax({
        url: weatherqueryURL,
        method: "GET"
    }).then(function (response) {
        var temp = response.data[0].temp
        $("#weatherspan2").text(temp)
        })

    $("#yearinput").val("2018");
    var element = document.querySelector('#calendar');
    caleandar(element, events, settings);

})

//When the give me something to do button is clicked, this generates the menu around the button
$(document).on("click", "#randomizer", function(event){
    event.preventDefault();
    if (cancelstate === false){
        cancelstate = true;
        $("#randomizer").text("Cancel")
        $("#option-acttype").append(typemenu);
        $("#option-acttype").append(accessmenu);
        $("#option-acttype").append(pricemenu);
        $("#option-acttype").append(peoplemenu);
        $("#option-acttype").append(generatebtn);
    } else {
        cancelstate = false;
        $("#randomizer").text("Give Me Something To DO");
        $("#eventinput").val("");
        $(generatebtn).remove();
        $(typemenu).remove();
        $(accessmenu).remove();
        $(pricemenu).remove();
        $(peoplemenu).remove();
    }
    
})

//when the generate button (from sub menu) is clicked
$(document).on("click","#generate", function(event){
    event.preventDefault();
    var eventqueryURL = "https://www.boredapi.com/api/activity?";
    var typechoice = $(typemenu).val();
    typechoice = typechoice.toLowerCase();
    var accesschoice = $(accessmenu).val();
    var pricechoice = $(pricemenu).val();
    var peoplechoice = $(peoplemenu).val();

    //specific checker for DIY because it doesnt fall neatly into the search string like the others
    if (typechoice !== "" ){
        if (typechoice === 'd.i.y.'){
            eventquery = eventqueryURL + "&type=diy"
        } else{
            eventqueryURL = eventqueryURL + "&type=" + typechoice;
        }
    }
    if (pricechoice !== ""){
        eventqueryURL = eventqueryURL + "&price=" + pricechoice;
    }
    if (peoplechoice !== ""){
        eventqueryURL = eventqueryURL + "&participants=" + peoplechoice;
    }
    if ((accesschoice) !== ""){
        if (accesschoice === 1){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0 + "&maxaccessibility=" + 0.1
        } else if (accesschoice === 2){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.1 + "&maxaccessibility=" + 0.2
        } else if (accesschoice === 3){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.2 + "&maxaccessibility=" + 0.3
        } else if (accesschoice === 4){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.3 + "&maxaccessibility=" + 0.4
        } else if (accesschoice === 5){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.4 + "&maxaccessibility=" + 0.5
        } else if (accesschoice === 6){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.5 + "&maxaccessibility=" + 0.6
        } else if (accesschoice === 7){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.6 + "&maxaccessibility=" + 0.7
        } else if (accesschoice === 8){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.7 + "&maxaccessibility=" + 0.8
        } else if (accesschoice === 9){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.8 + "&maxaccessibility=" + 0.9
        } else if (accesschoice === 10){
            eventqueryURL = eventqueryURL + "&minaccessibility=" + 0.9 + "&maxaccessibility=" + 1.0
        }
    }
    console.log(eventqueryURL);
    $.ajax({
      url: eventqueryURL,
      method: "GET"
    }).then(function(response) {
        if (response.error === 'No activities found with the specified parameters'){
            $("#eventinput").val("(Nothing found within your parameters)")
        }else{
            console.log(response);
            var eventresponse = response.activity;
            $("#eventinput").val(eventresponse);
        }
    });
})

//this function takes and stores an event when a user inputs it
$(document).on("click", "#eventadd", function (event) {

    event.preventDefault();
    var eventname = $("#eventinput").val().trim();
    var eventday = $("#dayinput").val().trim();
    var eventmonth = $("#monthinput").val().trim();
    var eventyear = $("#yearinput").val().trim();
    globalYear = eventyear;
    globalDay = eventday;
    globalMonth = eventmonth - 1;
    globalEvent = eventname;

    eventRef.push({
        eventname: eventname,
        eventday: eventday,
        eventmonth: eventmonth,
        eventyear: eventyear
    });

    $("#eventinput").val("");
    $("#dayinput").val("");
    $("#monthinput").val("");
    $("#yearinput").val("");

})

//when the add user button is clicked
$(document).on("click", "#addbutton", function (event) {
    userTotal = userTotal + 1;
    users = [];

    //prevents default action from being completed(refresh)
    event.preventDefault();
    //sets newName variable to the input value
    var name = $("#userinput").val().trim();
    var email = $("#emailinput").val().trim();
    var password = $("#passwordinput").val().trim();

    userRef.push({
        name: name,
        email: email,
        password: password
    })
    // userRef.set({
    //     users: userTotal
    // })
    $("#userinput").val("")
    $("#emailinput").val("")
    $("#passwordinput").val("")
});


$(document).on("click", ".userbutton", function () {
    users = []
    userTotal = userTotal - 1;
    var cancelkey = ($(this).attr("data-key"));
    $(this).remove()
    userRef.child(cancelkey).remove()
})

userRef.on("child_added", function (snapshot) {

    var username = snapshot.val().name;
    var newdiv = $("<div>");
    $(newdiv).text(username);
    $(newdiv).attr("data-key", snapshot.key);
    $(newdiv).addClass("userbutton")
    $(newdiv).addClass("btn")
    $(newdiv).addClass("btn-danger")
    $(newdiv).addClass("mt-2")
    $(newdiv).addClass("center-align")
    $("#roommatecard").append(newdiv)
    $("#roommatecard").append("<br>")
    users.push(username);

})

//this function runs whenever a user is removed from the system
userRef.on("child_removed", function (snapshot) {



})

//this function runs whenever an event is added to the system
eventRef.on("child_added", function (snapshot) {

    var dataDay = snapshot.val().eventday
    var dataYear = snapshot.val().eventyear
    var dataMonth = snapshot.val().eventmonth - 1
    var dataName = snapshot.val().eventname
    var dataEvent = { 'Date': new Date(dataYear, dataMonth, dataDay), 'Title': dataName, 'Link': '#' };
    events.push(dataEvent)
    // var newevent = {'Date': new Date(globalYear, globalMonth, globalDay), 'Title': globalEvent, 'Link':'#'};
    // events.push(newevent)
    $("#calendar").html("")
    var element = document.querySelector('#calendar');
    caleandar(element, events, settings);

})



