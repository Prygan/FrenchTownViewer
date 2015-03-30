var api_key="5c333b650e39c879301fd8258b7fbfec";
var secret="7dcd634ec53396b5";


$(document).ready(function() {
    autoCompleteInputCommune();
    $("#valid").on("click",function(){
	   getPhoto(document.getElementById("commune").value, document.getElementById("nbr_photo").value);
    });






    $("span.modal_close").on("click",fermerFenetreModale);
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
                    //alert("Erreurs, il n'y a aucune ville de ce nom la");
                }
            });
        },
        minlength:1,
        delay:100
    });
}


function getPhoto(tag,nbr_photo){
    vider_liste_photo();


    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+tag+"&tagmode=any&format=json&jsoncallback=?", 
	      function(data){
		  $.each(data.items, function(i,item){
		    if(i<nbr_photo){
          ajouter_dans_la_liste("<img id=\"imageAfficher"+i+"\" src=\""+item.media.m+"\"/>");
          $("#imageAfficher"+i).on("click",function(){
            ouvrirFenetreModale("titre:"+item.title+"</br>"+item.description+"</br> date: "+item.date_taken+"</br> auteur: "+item.author);

          });       
        }
		  });//fin each items
	});//fin getJSON
}

function ajouter_dans_la_liste(aAjouter){
    $('#result ul').append("<li>"+aAjouter+"</li>");
}

function vider_liste_photo(){
    $("#result ul").html("");
}


/* fenetre modale */
function ouvrirFenetreModale(texte){
    $("div.modal p").html(texte);
    $("div.modal").show();
    $("div.modalbg").show();


}

function fermerFenetreModale(){
    $(this).parent().hide();
    $("div.modalbg").hide();

}
/*----------------*/

function getTable(n){
  
}