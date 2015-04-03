
//liste permettant de trier les image, structure de chaque element du tableau: {id, url, description, titre, date, auteur}
var listeImage = new Array();

$(document).ready(function() {

    autoCompleteInputCommune();
    $("#valid").on("click",function(){
      getPhoto($("#commune").val(), $("#nbr_photo").val());
    });

    $("#tri #auteur").on("click", function(){
      actualiseAffichageImg(tableTrierPar(listeImage,"auteur"));
    });

    $("#tri #date").on("click", function(){
      actualiseAffichageImg(tableTrierPar(listeImage,"date"));
    });

    $("span.modal_close").on("click",fermerFenetreModale);
    
    $("#disposition #caroussel").on("click", function(){
      actualiseDisposition();
    });

    $("#disposition #liste").on("click", function(){
      actualiseDisposition();
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
                  alert("Erreurs, il n'y a aucune ville de ce nom la");
                }
            });
        },
        minlength:2,
        delay:10
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
          if ($("#filtreDate").val()!=""){
            date = parseDate($("#filtreDate").val())
            if (item.date_taken >= date) {
              listeImage[i]={"id": tmp, "url":item.media.m, "description":item.description, "titre": item.title, "date":item.date_taken, "auteur": item.author};
            };
          }else{  
            listeImage[i]={"id": tmp, "url":item.media.m, "description":item.description, "titre": item.title, "date":item.date_taken, "auteur": item.author};  
          }
        }
		  });//fin each items
      actualiseAffichageImg(listeImage);
	});//fin getJSON
}

function ajouter_dans_la_liste(aAjouter){
    $('.jcarousel ul').append("<li>"+aAjouter+"</li>");
}

function vider_liste_photo(){
    $(".jcarousel ul li").remove();
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

function parseDate(date)
{
  var mja = date.split("/");
  return mja[2] + "-" + mja[0] + "-" + mja[1] + "T00:00:00-00:00";
}



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
    id = "#"+img["id"];

    ajouter_dans_la_liste("<img id=\""+img["id"]+"\" src=\""+img["url"]+"\""+
                          " onclick=\"imgOnClick("+i+")\""+
                          "/>");
  };

  actualiseDisposition();
}
function imgOnClick(positionImage){
    ouvrirFenetreModale("titre:"+listeImage[positionImage]["titre"]+
      "</br>"+
      listeImage[positionImage]["description"]+
      "</br> date: "+
      listeImage[positionImage]["date"]+
      "</br> auteur: "+
      listeImage[positionImage]["auteur"]);
}


// Jcarousel //
function removeCaroussel(){
  $("#aSupr").html("");
  $(".jcarousel li").css("float","none");
  $(".jcarousel-wrapper").css("border","");

}

function caroussel(){

  $(".jcarousel-wrapper").css("border","2px solid black");
  var tmp = "<a href=\"#\" class=\"jcarousel-control-prev\">&lsaquo;</a>"+
        "<a href=\"#\" class=\"jcarousel-control-next\">&rsaquo;</a>"+
                  
        "<p class=\"jcarousel-pagination\">";

  $("#aSupr").html("");
  $("#aSupr").append(tmp);
  
  $(".jcarousel li").css("float", "left");


  (function($) {
      $(function() {
          $('.jcarousel').jcarousel();

          $('.jcarousel-control-prev')
              .on('jcarouselcontrol:active', function() {
                  $(this).removeClass('inactive');
              })
              .on('jcarouselcontrol:inactive', function() {
                  $(this).addClass('inactive');
              })
              .jcarouselControl({
                  target: '-=1'
              });

          $('.jcarousel-control-next')
              .on('jcarouselcontrol:active', function() {
                  $(this).removeClass('inactive');
              })
              .on('jcarouselcontrol:inactive', function() {
                  $(this).addClass('inactive');
              })
              .jcarouselControl({
                  target: '+=1'
              });

          $('.jcarousel-pagination')
              .on('jcarouselpagination:active', 'a', function() {
                  $(this).addClass('active');
              })
              .on('jcarouselpagination:inactive', 'a', function() {
                  $(this).removeClass('active');
              })
              .jcarouselPagination();
      });
  })(jQuery);
}

function actualiseDisposition(){
  var select = document.getElementById("disposition");
  var elemSelected = select.options[select.selectedIndex].value;

  if (elemSelected == "en caroussel") {
    caroussel();
  }else{
    removeCaroussel();
  }
}
// Jcarousel //