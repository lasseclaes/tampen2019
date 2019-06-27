<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <title>Map Test</title>

<!--- Meta-tag som fortæller mobilbrowseren at den ikke skal skalere indholdet -->
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">

<!--- Meta-tag som fortæller browseren, at dette dokument kan køre i fuld skærm uden browserknapper -->
    <meta name="apple-mobile-web-app-capable" content="yes">

<!--- Meta-tag som fortæller Apple apparater, at dette dokument ønsker en sort statusbar over app'en i fuld skærm -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

<!--- Links til jQuery Mobile frameworket -->
    <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.css" />
    <script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src="https://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.js"></script>

<!--- Under denne linje kan vi indsætte vore egne stylesheets eller scripts -->
    <link rel="stylesheet" href="style.css" />

    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAekLx2ITRiQ75UgKOSS8z2RChNYx-cQ3s"></script>
    <!-- evt ift. rRR<script src="http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true"></script> -->
    <!--<script src="add2home-webapp.js"></script> -->
    <!-- CSS til den mangler -
    http://cubiq.org/add-to-home-screen
https://developer.apple.com/library/mac/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
    -->

    <!-- dev disable cache of js - active code line below on production site -->
    <script src="script.js?<?php echo time();?>"></script>
    <!--<script type="text/javascript">
    document.write('<script src="script.js?' + Math.random()+'"></script>');
  </script>-->
  <!-- <script src="script.js"></script> -->
        <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49600863-1', 'it-studerende.dk');
  ga('send', 'pageview');
    </script>
    <!--<script type="text/javascript">
var addToHomeConfig = {
	animationIn: 'bubble',
	animationOut: 'drop',
	lifespan:2000,
	expire:5,
	touchIcon:true
	/*message:'This is a custom message. Your device is an <strong>%device</strong>. The action icon is `%icon`.'*/
};
</script>
    <link rel="stylesheet" href="cubiq/style/add2home.css">
    <script type="application/javascript" src="cubiq/src/add2home.js"></script>
    -->
</head>

<body>

    <div data-role="page" id="side1" data-theme="b">
	<header data-role="header" data-position="fixed">
	    <h1>Tampen brænder - "Du måsta flytta på dej"</h1>
	</header>
	<div id="infodiv"></div>
	<div id="cont" class="content ui-corner-all custom-corners" data-role="content">
	    <div id="intro">
	    	<p>Et sted inden for cirklen på kortet, gemmer tampen sig. Du skal finde tampen.<br /></p>
		    <blockquote>Nu Är Vi Här!<br />Nu Är Vi Här!<br />Nu Är Vi Här!<br>Var Är Vi?
		    </blockquote>
		<p class="right">- bob hund, som - som bekendt - er verdens bedste band nogensinde</p>
		<h1>Husk: Du måsta flytta på dej</h1>
		<button id="startTampen" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-bottom ui-icon-navigation">Start tampen brænder</button>
	    </div>
	    <div id="user-info" class="ui-corner-all custom-corners">
		<div id="for-the-users" class="ui-bar ui-bar-a">
		    Siden loader...
		</div>
		<div id="always-on" class="ui-body ui-body-a">
		</div>
	    </div>
	</div>

	<footer data-role="footer" data-position="fixed">
	    <div id="map-canvas">
	    </div>
	    <div data-role="navbar" data-type="horizontal">
		<ul>
		    <!--<li><a href="#" id="hererjeg-btn" class="ui-btn">Hvor er jeg?</a></li>-->
		    <li><a href="#" id="play-btn" class="ui-shadow ui-btn ui-corner-all">Fortsæt</a></li>
		    <li><a href="#" id="pause-btn" class="ui-btn pause">Pause</a></li>
		    <li><a href="#" id="cheat-btn" class="ui-btn">SNYD on/off</a></li>
		    <!--<li><a href="#" id="sound-btn" class="ui-btn">Indstillinger</a></li>-->
		    <li><a href="#" id="udviklerhejs-btn" class="ui-btn">udviklerhejs on/off</a></li>
		</ul>
	    </div>
	</footer>

    </div><!-- Page -->
</body>
</html>
