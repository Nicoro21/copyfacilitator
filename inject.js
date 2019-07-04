//content script
var clickedEl = null;
var chk="";

document.addEventListener("mousedown", stockEltClicked, true);

var champs=new Array;
//Stoque elt cliqué
function stockEltClicked(event){
    //right click
    if(event.button == 2) { 
        clickedEl = event.target;
	    console.log('click');
    }
};
//Remplacement du loader
var urlimg1 ="https://www.pkparaiso.com/imagenes/pokedex/pokemon/"
function getRandomImg() {
  var num = 1001 + Math.floor(Math.random() * 201);
  return urlimg1 + num.toString().substr(1,3) + ".png";
}

Math.floor(Math.random() * 201);
images = document.getElementById("img1");
images2 = document.getElementById("img2");
images3 = document.getElementById("img3");
images4 = document.getElementById("img4");

changeImg();
images.setAttribute("height","");
images2.setAttribute("height","");
images3.setAttribute("height","");
images4.setAttribute("height","");

var intervalID = window.setInterval(changeImg, 2000);
function changeImg(){
    images.setAttribute("src", getRandomImg());
    images2.setAttribute("src", getRandomImg());
    images3.setAttribute("src", getRandomImg());
    images4.setAttribute("src", getRandomImg());
}
//Fin du loader


//Chargement des contrôle dans saisie TS V1 + scan des cases des profils si page profils  
 $('iframe').load(function(){
	console.log("chargement de l'iframe");
         var contents = $(this).contents(); // contents of the iframe
	  $(contents).find(".row-champ").each(function(){
		  var valeurduchamp="";
		  var nomduchamp=$(this).find('label')[0].outerText;
		  nomduchamp = nomduchamp.replace(" :","");
		  var idduchamp ="";
		  if($(this).find("textarea").length>0){
			  valeurduchamp=$(this).find("textarea").val();
			  idduchamp =$(this).find("textarea").attr("id");
			  };
		   if($(this).find("input:text").length>0){
			valeurduchamp=$(this).find("input:text").val();	
			 idduchamp =$(this).find("input:text").attr("id");
		  }; 
		  if(valeurduchamp!=""){
				  champs.push( {"nom" : nomduchamp,"id" : idduchamp,"valeur":valeurduchamp});
			  }		 
	  });
	  var idelt=0;
	  $(contents).find("table.listing.normal").each(function(){
		  var valeurduchamp="";
		  var nomduchamp="listing";
		  var idduchamp ="";
		  if($(this).find("tr").length>1){
			var titreligne= "_" + $(this).text(); 
			titreligne= titreligne.replace("ModifierDupliquerSupprimer","");
			titreligne= titreligne.replace("RemonterDescendre","");
			titreligne =  titreligne.substring(0, 20);
			valeurduchamp="";			
			idduchamp ="";
			  $(this).find("tr").each(function(){
				  var nbcol=0;
				   $(this).find("td").each(function(){
						   if(nbcol<3) {
						   nomduchamp= titreligne  + "->" + $(this).text().substring(0, 15) ;
						   valeurduchamp=$(this).text();
						   idduchamp ="lis-" +idelt;
						    idelt++;
							if(valeurduchamp!=""){
							  console.log (idduchamp +" - " + nomduchamp + " - " + valeurduchamp);
							  champs.push( {"nom" : nomduchamp,"id" : idduchamp,"valeur":valeurduchamp});
							}
							nbcol++;
						  };
					   });
				});
			};
	  });
	  //Scan des cases des profils
	  chk="";
	  $(contents).find("input[type='checkbox']").each(function(){		
		var idchk= $(this).attr('id');
		if($(this).is(':checked') && !idchk.includes(',') ) {			
			idchk = idchk.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
			chk+="if ($(\"#fcentre\").contents().find('#"+ idchk +"').prop('checked') == false) $(\"#fcentre\").contents().find('#"+ idchk +"').click();";
		}
		console.log($(this).attr('checked'));
	  });
	  console.log(chk)
	  console.log("champs : ");
	  console.log(champs);
	  chrome.runtime.sendMessage({action: "rempli",data : champs}, function(response) {
		  console.log(response.farewell);
		});
        $(contents).find("body").on('mouseup', stockEltClicked);
});

    
//Gestion des evénements du menu contextuel
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.name == "getClickedEl") {
	  console.log("renvoi de l'élement" + request.id);  
	    console.log($("#"+request.id));	    
		clickedEl.value = request.valeur;
        sendResponse({value: clickedEl.value});
	}
	if(request.name == "copier") {
		console.log("reçu il faut copier les cases " + request.id);
		sendResponse(chk);
	  }
	  if(request.name == "coller") {
		console.log("reçu il faut coller les cases" + request.valeur);  
		eval(request.valeur);		
		sendResponse({value: "collé"});
	  } 
});


