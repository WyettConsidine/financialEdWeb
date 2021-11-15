


function makeApiCall(){
	var searchterm = document.getElementById("searchTerm").value;
	var url = 'https://www.omdbapi.com/?apikey=aca4c7b4&s='+searchterm;
	console.log("URL call: "+url);
	$.ajax({url:url, dataType:"json"}).then(function(data){
		console.log(data);
		document.getElementById('movieDiv').style.display = 'block';
		var cards = '<div class="row">';
		var numCards = Object.keys(data.Search).length;
		for(var i = 0;i<numCards;i++){
			var title = "'"+data.Search[i].Title+"'";
			//console.log(title);
			cards += '<div class="card" style:"width=300"><img class="card-img-top" src='+data.Search[i].Poster+' alt="Card image cap" style:"width=298 height=auto"><div class="card-body"><h5 class="card-title">'+title+'</h5><button href="#reviewModal" data-toggle="modal" onClick="openModal('+title+')" class="btn btn-primary">Add Review</button></div></div>';
			
		}
		document.getElementById('movieDiv').innerHTML = cards;
	})

}


function openModal(title){
	console.log(title);
	document.getElementById("title").value = title;
}


function dropdownPW() {
  document.getElementById("myDropdownPW").classList.toggle("show");
}

function dropdownBl() {
	document.getElementById("myDropdownBl").classList.toggle("show");
  }

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}