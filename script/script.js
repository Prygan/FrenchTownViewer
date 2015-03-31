var api_key="5c333b650e39c879301fd8258b7fbfec";
var secret="7dcd634ec53396b5";


$(document).ready(function() {
    autoCompleteInputCommune();
    $("#valid").on("click",function(){
	getPhoto(document.getElementById("commune").value,document.getElementById("nbr_photo").value);
    });
});


function autoCompleteInputCommune(){
    
    $("#commune").autocomplete({
        source: function(requete, reponse) {
            $.ajax({
                url: "http://infoweb-ens/~jacquin-c/codePostal/commune.php",
                dataType: "json",
                data: "commune="+$('#commune').val()+"&maxRows=10",
                type:"POST",
                success:function(data) {
                    reponse($.map(data, function(item) {
                        return {
                            label: item.Commune,
                            value:function() {
                                return item.Ville;
                            }
                        }
                    }));
                },
                error: function(request, error) {
                  alert("Erreurs");
                }
            });
        },
        minlength:3,
        delay:10
    });
}


function getPhoto(tag,nbr_photo){
    vider_liste_photo();
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+tag+"&tagmode=any&format=json&jsoncallback=?", 
	      function(data){
		      $.each(data.items, function(i,item){
		        if(i<nbr_photo)
			       ajouter_dans_la_liste("<a href=\"\"><img src=\""+item.media.m+"\"/></a>");
		  });
	});
    
}

function ajouter_dans_la_liste(aAjouter){
    $('#result ul').append("<li>"+aAjouter+"</li>");
}

function vider_liste_photo(){
    $("#result ul").html("");
}
