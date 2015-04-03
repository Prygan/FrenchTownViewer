var api_key="5c333b650e39c879301fd8258b7fbfec";
var secret="7dcd634ec53396b5";


//liste permettant de trier les image, structure de chaque element du tableau: {id, url, description, titre, date, auteur}
var listeImage = new Array();

$(document).ready(function() {

    autoCompleteInputCommune();
    $("#valid").on("click",function(){
      getPhoto(document.getElementById("commune").value, document.getElementById("nbr_photo").value);
    });

    $("#trieIdentifiant").on("click", function(){
      actualiseAffichageImg(tableTrierPar(listeImage,"auteur"));
    });

    $("#trieDate").on("click", function(){
      actualiseAffichageImg(tableTrierPar(listeImage,"date"));
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
    listeImage = new Array();
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+tag+"&tagmode=any&format=json&jsoncallback=?", 
	      function(data){
		  $.each(data.items, function(i,item){
		    if(i<nbr_photo){
          var tmp = "imageAfficher"+i;
          listeImage[i]={"id": tmp, "url":item.media.m, "description":item.description, "titre": item.title, "date":item.date_taken, "auteur": item.author};

          ajouter_dans_la_liste("auteur :"+item.author+"<img id=\""+tmp+"\" src=\""+item.media.m+"\"/>");

          $("#"+tmp).on("click",function(){
            ouvrirFenetreModale("titre:"+item.title+"</br>"+item.description+"</br> date: "+item.date_taken+"</br> auteur: "+item.author);
          });
          
        }
		  });//fin each items
      actualiseAffichageImg(listeImage);
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


function sortString(field){
    return function(a,b){
      var x = a[field].toLowerCase();
      var y = b[field].toLowerCase();
      if (x < y){
        return -1;
      }
      if (x > y){
        return 1;
      }
      return 0;
    }
}

function tableTrierPar(table, trierPar){
  return table.sort(sortString(trierPar));
}

function actualiseAffichageImg(table){
  vider_liste_photo();

  for (var i = 0; i < table.length; i++) {
    img = table[i];
    var id = "#"+img["id"];

    ajouter_dans_la_liste("auteur :"+img["auteur"]+
                          "</br>date : "+img["date"]+
                          "</br><img id=\""+img["id"]+"\" src=\""+img["url"]+"\"/>");
    $(id).on("click",function(){
      ouvrirFenetreModale("titre:"+img["titre"]+"</br>"+img["description"]+"</br> date: "+img["date"]+"</br> auteur: "+img["auteur"]);
    });
  };
}



