var opacite_in = 1;
var opacite_out = .6;
var delaisaffichage = 3000;
var idnomconsole = "consoletool";
var idnommessage = "messagetool";
window.onload = function() {
    var laconsole = document.createElement("div");
    var messagetool = document.createElement("div");
    var enhautde = '.5rem';
    var agauchede = '.5rem';
    var delaisaffichage = 3000;
    laconsole.id = idnomconsole;
    messagetool.id = idnommessage;
    laconsole.style = 'position: fixed;z-index:10000;opacity:.2;width: auto; bottom: ' + enhautde + '; left: ' + agauchede + '; margin: 0; padding: .5rem;background-color:rgba(0,0,0,.6);';
    messagetool.style = "color: white;  line-height: .5em; top: 0; left: 0; margin: 0;";
    laconsole.style.outline = "1px solid rgba(255,255,255, .4)";
    document.body.appendChild(laconsole);
    laconsole.appendChild(messagetool);
    //------------------------------------------------------
    var visilibilitite = document.getElementById(idnomconsole);
    visilibilitite.addEventListener("mouseover", function(event) {
        event.target.style.opacity = opacite_in; // opacity à fond por y voir quelque chose !
        messagetool.style.lineHeight = "1em";
        refresh_affichage(1);
    }, false);
    //------------------------------------------------------
    visilibilitite.addEventListener("mouseout", function(event) {
        setTimeout(function() { // on remet l'opacité à presque rien pour ne pas gener l'affichage
            event.target.style.opacity = opacite_out;
            messagetool.style.lineHeight = "initial";
            refresh_affichage(0);
        }, delaisaffichage);
    }, false);
    //------------------------------------------------------
    refresh_affichage(0);

}

window.addEventListener('resize', function(event) {
    refresh_affichage(0); // si le user resize la page ! pffff' on relance le calcul ;(
});

function refresh_affichage(choix) {
    var alertes = [320, 576, 768, 992, 1200, 1600]; //du plus petit au plus grand
    var format = ['SM', 'MD', 'LG', 'XL', 'XL', 'XL']; //du plus petit au plus grand
    var alertes_couleurs = ['black', 'DarkOrange', 'DarkRed', 'brown', 'Indigo', 'Maroon']; //du plus petit au plus grand
    var screen_H = window.innerHeight;
    var screen_W = window.innerWidth;
    var coolquivabien = 'black';
    var numquivabien = 0;
    var tools_txt = '';
    for (i = 0; i <= (alertes.length - 1); i++) {
        if (screen_W >= alertes[i]) {
            coolquivabien = alertes_couleurs[i];
            numquivabien = i;
        }
    }
    document.getElementById("consoletool").style.backgroundColor = coolquivabien;
    if (choix != 1) {
        tools_txt = '[' + format[numquivabien] + '] ' + screen_W + '/' + screen_H + 'px';
    } else {
        tools_txt = screen_W + '/' + screen_H + 'px <br/>';
        // tools_txt = tools_txt + '[Tools] <a onclick="opaplus(\'plus\')" style="cursor: pointer;">PLUS</a> <a onclick="opaplus(\'moins\')" style="cursor: pointer;">MOINS</a> <br/>';
        tools_txt = tools_txt + '[Rules] < ' + format[numquivabien] + '';
        tools_txt = tools_txt + ' < ' + alertes[numquivabien] + 'px <br/>';
        tools_txt = tools_txt + '[Actual_Rule] N° ' + (numquivabien) + ' <br/>';
        tools_txt = tools_txt + '[Tot_Rules] ' + alertes.length + ' <br/>';
        tools_txt = tools_txt + '[Actual_Color] ' + coolquivabien;
    }
    document.getElementById("messagetool").innerHTML = tools_txt;
}