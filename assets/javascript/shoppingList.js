var config = {
    apiKey: "AIzaSyBxxfQDhSbQQJxQ0fC753343Pa1DWn42Ks",
    authDomain: "shoppinglist-1a21c.firebaseapp.com",
    databaseURL: "https://shoppinglist-1a21c.firebaseio.com",
    projectId: "shoppinglist-1a21c",
    storageBucket: "shoppinglist-1a21c.appspot.com",
    messagingSenderId: "705054488424"
  };
  firebase.initializeApp(config);
  var database = firebase.database(); 
  eventRef = database.ref()


  database.ref().on("child_added", function (snapshot) {
      console.log(snapshot.val())
      console.log(snapshot.key)
        var li = document.createElement("li");
        li.dataset.key = snapshot.key
    var t = snapshot.val().shopping;
    li.innerHTML = t;
   
  
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    var list = document.querySelector('#myUL');
    list.appendChild(li)
    span.onclick = function() {
        console.log(this.dataset.key)
        var div = this.parentElement;

        div.style.display = "none";
        database.ref().child(div.dataset.key).remove();
    }
    
  }) 

var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  database.ref().push({
    shopping: inputValue
  });

}