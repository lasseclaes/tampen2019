$("document").ready(function (){
   //http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
    $("#play-btn").on("click", startItAll);
    $("#udviklerhejs-btn").on("click", function(){
      $("#infodiv").toggle();
    });
    $('#infodiv, #user-info').hide();
    $('#cheat-btn').on("click", snyd);
    //$('#map-canvas').hide();
    $(".pause").on("click", updatePause);
    $("#startTampen").on("click", startItAll);
    $(".ui-footer").hide();

    //"soundhack" - for playing sound on mobile devices - see the soundsInit function
    var startSound = new Audio('sounds/start.mp3');
    var succesSound = new Audio('sounds/succes.mp3');
    var koldSound = new Audio('sounds/kold.mp3');
    var varmSound = new Audio('sounds/varm.mp3');
    var flyttadigSound = new Audio('sounds/flyttadig.mp3');

    //console.log (startSound);
/*TESTS
    alert ("The page just loaded!");
    $("#hererjeg").on("click", scriptTest);
    function scriptTest(e) {
        alert("hep");
        e.preventDefault();
    }

    /*var map;
function initialize() {
    var mapOptions = {
      zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
*/

//---------------  GLOBALE VARIABLER  -------------------------------------------------------
//var globStartLat;
//var globStartLng;
var globStart;
var globUnderWay; //lcj
var globSecretTil; //google notation for tampen
//var infowindow = new google.maps.InfoWindow();
var oldDistance;
var tampenRadius = 600; // i meter (og fugleflugt), bruges ikke p.t. ca.-værdier er hardcoded
var voresKort;
var intervalHandle;
var markerSlut;

//---------------  STARTFUNKTION  -------------------------------------------------------
    function getPos(e){  //gør følgende når man klikker på knappen med id="hererjeg":
	if (navigator.geolocation) {        	//hvis browseren har en funktion der angiver geografisk placering...
	    navigator.geolocation.getCurrentPosition(posSuccess, posError, {enableHighAccuracy: true}); //hvis ja, så find placering og start funktionen "succes" ...
	    //navigator.geolocation.watchPosition(posSuccess, posError, {enableHighAccuracy: true});
	} else {                            	// ellers ...
	    alert('Geografisk placering er ikke understøttet af denne browser'); // Vis en dialogboks der fortæller at browseren aldrig har hørt om den funktion ( = ældre browser)
	}
    }
//---------------  SLUT PÅ STARTFUNKTION  -----------------------------------------------

//Nedenfor beskrives funktionen der indsætter position med tekst ... og på et google-kort
//---------------  FUNKTION DER BEHANDLER POSITIONSDATA  --------------------------------
function posSuccess(position) {             // Beskrivelse af funktionen, som behandler positionsdata oppe fra ovenstående funktion
       //console.log("var globStartLat start" + globStartLat);
       //alert(position);
       if (globStart == undefined){
	    //$("#always-on").append("So it begins");
	    globStartLat = position.coords.latitude;
	    globStartLng = position.coords.longitude;
       //infowindow.setContent("lat:" + position.coords.latitude +", lng:" + position.coords.longitude);
       //console.log("lat:" + position.coords.latitude +", lng:" + position.coords.longitude);  // skriv koordinaterne for den fundne position i konsol-vinduet
	//alert ("lat:" + position.coords.latitude +", lng:" + position.coords.longitude);
	mapInit(position);
	}
	else{
	    globTempLat = position.coords.latitude;
	    globTempLng = position.coords.longitude;
	    globUnderWay = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    getDirections(globUnderWay);

 /*   var marker = new google.maps.Marker({
	position: globUnderWay,
	title: "Hello World!",
	map: voresKort
    });

// To add the marker to the map, call setMap();
//marker.setMap(voresKort);
	   // voresKort.marker.setPosition (globUnderWay);
*/
	}

//---------------AFSLUTNINGSKRØLLEPARANTES-------------------------------------
} 					    	// Først her afsluttes funktionen "success" - vi kunne naturligvis have brudt det
						// op i flere mindre funktioner, men her har altså vi gjort det hele i een funktion

//---------------SLUT PÅ SUCCESS_FUNKTIONEN-----------------------------

//---------------FUNKTION DER KØRES HVIS DER SKER EN FEJL MED POSITIONSBESTEMMELSEN-----------------------------
function posError(msg) {
    var errMsg = typeof msg == 'string' ? msg : "<h1 class='err'>Det lykkedes ikke at bestemme din position!</h1>";
    //$('#infodiv').html(errMsg);
    $('#always-on').html(errMsg);
    alert ("et lykkedes ikke at bestemme din position!");
}

function mapInit(position){
    //---------------  TEKSTUDSKRIFT AF POSITION PÅ SKÆRMEN  --------------------------------
   var output="<h3>";                         	// Ny variabel til vores udskrivning af positionsdata
    output+="Din startposition er:";
    output+="</h3>";
    output+="<p>";
    output+="Breddegrad: " + position.coords.latitude;
    output+="</p>";
    output+="<p>";
    output+="Længdegrad: " + position.coords.longitude;
    output+="</p>";
    output+="<p>";
    output+="Højde: " + position.coords.altitude;
    output+="</p>";
    output+="<p>";
    output+="Nøjagtighed: " + position.coords.accuracy; + " meter"
    output+="</p>";
    output+="<p>";
    output+="Retning: " + position.coords.heading;
    output+="</p>";
    output+="<p>";
    output+="Hastighed: " + position.coords.speed;
    output+="</p>";
    $('#infodiv').html(output);

						// Den følgende kode indsætter et Google kort som er centreret
						// på den aktuelle position (husk! vi er stadig i funktionen der hedder "success")

//---------------  INDLEDENDE ØVELSER  ---------------------------------------
    globStart = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //SLET?? var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // vi opretter en ny variabel som er en google-maps-position og vi sætter den til at være lig med vores fundne position
    //SLET?? globStart = latlng;
    console.log ("var globStart:" + globStart);
    var myOptions = {                      	// Vi opretter en variabel som indeholder indstillinger til Google kortet.
	//zoom: 12,                              	// zoom niveauet på kortet - "15" svarer cirka til en bydel eller et kvarter
	zoom: 15, //p.t. bedst
	//zoom: 6,
        center: globStart,                        // centrerer kortet på koordinaterne i vores koordinatvariabel
	mapTypeControl: false,			// Vi vil ikke have knapper til at vælge korttype
	zoomControl: false,			// Vi vil heller ikke have knapper til at vælge zoom
	streetViewControl: false,		// Vi vil slet ikke have knapper til at vælge streetview
	noClear: true,                          // Hvis vi opdaterer positionen skal kortet ikke slettes først
	draggable: true,
        //disableDefaultUI: true, //lcj
	mapTypeId: google.maps.MapTypeId.ROADMAP	// Vi vil gerne bede om et almindeligt vejkort - vi kunne også bede om SATELLITE eller HYBRID eller TERRAIN
    };

    var kortDiv = $('#map-canvas');   		// Vi opretter en variabel som peger på det html-element der skal indholde kortet (her er det en div med id="map-canvas")

    //alert ("remove loader");
    $(".ui-loader").remove();
//--------------- SELVE KORTET  ---------------------------------------


    voresKort = new google.maps.Map(kortDiv[0], myOptions); // Her oprettes selve kortet som et objekt vi kalder "voresKort"
/*---------------Markørliste

//var placering = new Array;
//placering = [
//    {titel:'Et sted i dk',lat:55.4, lng:12.3},
//    {titel:'Et sted i dk',lat:55.5, lng:12.2},
//    {titel:'Et sted i dk',lat:55.4, lng:12.1}
//    ];
//
//var marker = new Array;
//
//$.each(placering,function(index, pos){
//
//	marker[index] = new google.maps.Marker({
//	    position: new google.maps.LatLng(pos.lat, pos.lng),
//	    title: pos.titel,
//	    map:voresKort
//	    });
//
//    });
*/



//---------------POSITIONSMARKØR----------------------------------------
//unofficiel list: https://stackoverflow.com/questions/31197596/google-map-api-marker-icon-url
//lcj
   var marker = new google.maps.Marker({     	// Her oprettes og indsættes en markør som placeres på vores kort på den fundne position
	position: globStart,
	map: voresKort,
	title: "Her startede du",
  icon: "https://maps.google.com/mapfiles/ms/icons/question.png"
	//icon: "https://barnetwalks.co.uk/google-map-pins/white-question-mark-map-pin.png"
	//icon:"http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
//
//

//---------------NØJAGTIGHEDSCIRKEL-------------------------------------

    var circle = new google.maps.Circle({     	// Her oprettes en cirkel som vi placerer samme sted på kortet
	center: globStart,
	//accuracyRadius: position.coords.accuracy,     	// Cirklens radius (i meter) sætter vi lig med positionsnøjagtigheden ("position.coords.accuracy")
	accuracyRadius: position.coords.accuracy,
        radius: tampenRadius,
        fillColor: "yellow",
	strokeColor: "green",
	map: voresKort
    });
    generateSecretTil();
    //console.log("cirkelradius: " + circle.radius); //i meter - giv agt duer p.t. ikke
}

function generateSecretTil(){
    ////---------------POSITIONSMARKØR 2----------------------------------------
    //
	/* svarer ca. til 1.5 km
	var secretLat = (Math.random() * 0.025) - 0.0125 + globStartLat;
	var secretLng = (Math.random() * 0.025) - 0.0125 + globStartLng;
	*/
	//ca. 750m
	/*var secretLat = (Math.random() * 0.01200) - 0.006 + globStartLat;
	var secretLng = (Math.random() * 0.01200) - 0.006 + globStartLng;
	*/
	//500 m?
	var secretLat = (Math.random() * 0.01) - 0.005 + globStartLat;
	var secretLng = (Math.random() * 0.01) - 0.005 + globStartLng;

	globSecretTil = new google.maps.LatLng(secretLat, secretLng);
	console.log ("globSecretTil: " + globSecretTil);

	getDirections(globStart);
}

function getDirections(position){
	var directionsService = new google.maps.DirectionsService();
	var directionRequest = {
	    origin:position,
	    destination: globSecretTil,
	    travelMode: google.maps.DirectionsTravelMode.WALKING,
	    unitSystem: google.maps.UnitSystem.METRIC
	}

	directionsService.route(directionRequest, function(response, status) {
	    //if (false){
	    if (status == google.maps.DirectionsStatus.OK) {
		    //http://stackoverflow.com/questions/4482950/how-to-show-full-object-in-chrome-console
		    //console.log("response: " + JSON.stringify(response.routes[0].legs[0]));
		    console.log("Response: "); console.dir(response);
		    var currentDistanceToTamp = response.routes[0].legs[0].distance["value"];

		    //VIGTIGT - her sættes globSecretTil en punkt, som har en adresse (altså er vej en vej)
		    globSecretTil = response.routes[0].legs[0].end_location;
		    globUnderWay = response.routes[0].legs[0].start_location;
		    //alert (globUnderWay);
		    console.log("End Address: " + response.routes[0].legs[0].end_location);
		    console.log("End Address: " + response.routes[0].legs[0].end_address);
		    $("#for-the-users").html("<p>Du er omkring " + response.routes[0].legs[0].start_address + ", dvs. ca. " + response.routes[0].legs[0].distance["text"] + " eller " + response.routes[0].legs[0].distance["value"] + " m fra tampen</p>");
		    $("#infodiv").prepend("Du er " + response.routes[0].legs[0].distance["text"] + " eller " + response.routes[0].legs[0].distance["value"] + " m fra tampen</p>");
		    // + response.routes[0].legs[0].start_location
		    $("#infodiv").prepend("<p>"
			   + response.routes[0].legs[0].start_address) + " ??<br />";

		comparePos(currentDistanceToTamp);
	    }
	    else{
		//$("#always-on").prepend("DID NOT GET DIRECTIONS");
		$("body").prepend("DID NOT GET DIRECTIONS");
	    }
	});

    /*  fra http://stackoverflow.com/questions/4804495/google-maps-v3-snap-to-nearest-street
	var directionsService = new google.maps.DirectionsService();

    google.maps.event.addListener(map, 'click', function(event) {
	var request = {
	    origin:event.latLng,
	    destination:event.latLng,
	    travelMode: google.maps.DirectionsTravelMode.DRIVING
	};

	directionsService.route(request, function(response, status) {
	  if (status == google.maps.DirectionsStatus.OK) {
	      var marker = new google.maps.Marker({
		 position: response.routes[0].legs[0].start_location,
		 map: map,
		 title:"Hello World!"
	      });
	  }
	});
    });
    */

}

function comparePos(currentDistanceToTamp){
    if (oldDistance == undefined){
	//$("#always-on").html("<p>Tampen gemmer sig.</p>");
	   //playSound("start");
    }
    //Math.abs(x) - få absolut tal, men vist ikke nødvendigt
    else if(currentDistanceToTamp <= 20){
	$("#always-on").prepend("<h1 class='succes'>Tillykke manner! Du fandt tampen!</h1>");
	//playSound("succes");
  succesSound.play();
    }
    else if(currentDistanceToTamp > oldDistance){
	$("#always-on").prepend("<p class='kold'>Det bliver koldere!</p>");
	//playSound("kold");
  koldSound.play();
	drawMarker("kold");
    }
    else if(currentDistanceToTamp < oldDistance){
	$("#always-on").prepend("<p class='varm'>Det bliver varmere!</p>");
	//playSound("varm");
  varmSound.play();
	drawMarker("varm");
    }
    else{
	$("#always-on").prepend("<p class='samesame'>Flytter du dig overhovedet? Du måsta flytta på dig!</p>");
	//playSound("flyttadig");
  flyttadigSound.play();
    }
    oldDistance = currentDistanceToTamp;
}

function drawMarker(iconPath){
		if (iconPath == "varm"){
		    iconPath = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
		}
		else if (iconPath == "kold"){
		    iconPath = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
		}
		var markerUnderWay = new google.maps.Marker({   // Her oprettes og indsættes en markør som placeres på vores kort på den fundne position
		    position: globUnderWay, //response.routes[0].legs[0].start_location,
		    map: voresKort,
		    title:"Her er du nu!!",
		    icon: iconPath, //"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
		    animation: google.maps.Animation.BOUNCE
		});
}

//SLET - not used?
function playSound(delAfFilnavn){
	/*var audioSrc = new Array();
	    audioSrc[0] = "sounds/kold.mp3";
	    audioSrc[1] = "sounds/koldere.mp3";
	    audioSrc[2] = "sounds/varm.mp3";
	    Se sounds-mappen*/

	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', 'sounds/' + delAfFilnavn + '.mp3');
	/*audioElement.setAttribute('preload', 'auto');*/
	/*audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.load();*/
        $.get();
	audioElement.play();

        /*$('#play').click(function(){
        audioElement.play();
        });

        $('.pause').click(function() {
        audioElement.pause();
        });*/
}

    function startUpdate(miliseconds) {
	//slet $("#play_pause").removeClass(play);
	if ( miliseconds == undefined ){
	    miliseconds = 10000;
	}
	intervalHandle = setInterval(getPos, miliseconds);
	//alert(miliseconds);
	//alert ("PLAY");
    }

    function updatePause(){
	clearInterval(intervalHandle);
	//togglePlayPauseClass();
	console.log ("PAUSE");
	$(".pause").hide();
	$("#play-btn").show();
	//$(".play").on("click", startUpdate);
    }

/*   function togglePlayPauseClass(){
	$("#pause-btn").toggleClass("play").toggleClass("pause");
	console.log ("toggle");
    }
/*	var intervalHandle = setInterval(changeImage,5000);

	myImage.onclick =  function() {
	clearInterval(intervalHandle);
	};
*/
//--------------------------------------------------------------------------------------------------------------

function snyd (){
    	if (markerSlut == undefined){
	    markerSlut = new google.maps.Marker({
		//position: response.routes[0].legs[0].start_location,
		//position: response.routes[0].legs[0].end_location,
		map: voresKort,
		//optimize: false,
		animation: google.maps.Animation.DROP,
		position: globSecretTil,
		title:"Her skal du hen"
		//icon:"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
	    });

	      var infowindow = new google.maps.InfoWindow({
		content: "Her er tampen, din snyder!"
	    });

	    infowindow.open(voresKort,markerSlut);
	}
	else{
	    markerSlut.setMap(null);
	    markerSlut = undefined;
	}

}

window.onbeforeunload = function(){
  return 'Hvis du forlader siden, får du en ny position og skal starte forfra.';
};

/*function makeSecretPos(e){
     var markSecretPos = new google.maps.Marker({   // Her oprettes og indsættes en markør som placeres på vores kort på den fundne position
	position: new google.maps.LatLng(55.7, 12.5),
	map: voresKort,
	title:"Her skal du hen!!"
	//icon:"icon.png"
    });
}
*/

function soundsInit(){
  startSound.play();
  //console.log (startSound);

  //sound hack for playing on mobile devices - https://stackoverflow.com/questions/41221581/play-multiple-audio-sounds-in-mobile-devices-with-javascript

  /*succesSound.volume = 0;
  koldSound.volume = 0;
  varmSound.volume = 0;
  flyttadigSound.volume = 0; */

  succesSound.play();
  succesSound.pause();
  koldSound.play();
  koldSound.pause();
  varmSound.play();
  varmSound.pause();
  flyttadigSound.play();
  flyttadigSound.pause();

  /*succesSound.volume = 1;
  koldSound.volume = 1;
  varmSound.volume = 1;
  flyttadigSound.volume = 1; */
}

function startItAll(){
    //alert("argh!");
    //alert ("v6");
    $(".ui-loader").css("display", "block");
    $("#map-canvas").css("display", "block");
    $("#intro").remove();
    $(".pause").show();
    $("#user-info").show();
    $(".ui-footer").show();
    $("#play-btn").hide();
    getPos();
    soundsInit();
    startUpdate(10000);
}
//SLUT på $("document").ready(function (){
});
