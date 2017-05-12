
var _carta1=0;
var _carta2=0;

var _nombreJugador;
var _nivel;
var _segundos=0;
var _minutos=0;
var _horas=0;
var _timerID;

var _nCartas;
var _cartas;

var _isJugando=false;
var _isPrimerClick=false;
var _isTapando=false;
var _isShowRecords=false;
var _parejas=0;

var _recNom= new Array(10);
var _recTime= new Array(10);
var _recNivel= new Array(10);

var _nRecords=10;
var _records=[];



function onClickNombre(){
    limpiaNombre();
}

function onBlurNombre(){
    checaNombre();
}

function onClickRecors(){

    var divRecords= document.getElementById("records");
    var height=_records.length*30;
    if(_records.length)
        height+=30;
    if(!_isShowRecords)
    {
        divRecords.className="recordsHover";
        divRecords.style.height=height+"px";
        _isShowRecords=true;
    }
    else
    {
        divRecords.className="records";
        divRecords.style.height="0px";

        _isShowRecords=false;
    }

}

function insertaRecords(){
    var auxRecord;
    var newRecord={name: _nombreJugador, hrs: _horas, min: _minutos, seg: _segundos, level: _nivel};
    _records.push(newRecord);
        
    ordenaRecords();
    
    if(_records.length > _nRecords)
        _records.pop();

    var divRecords= document.getElementById("records");

    while (divRecords.firstChild)
        divRecords.removeChild(divRecords.firstChild);

        var tabla=document.createElement("table");

        var tr= document.createElement("tr");
        var th= document.createElement("th");
        th.innerHTML="Nombre";
        tr.appendChild(th);
        th= document.createElement("th");
        th.innerHTML="Tiempo";
        tr.appendChild(th);
        th= document.createElement("th");
        th.innerHTML="Nivel";
        tr.appendChild(th);
        tr.className="trtitle";
        divRecords.appendChild(tr);
        for (var i = 0; i < _records.length; i++){
            tr=document.createElement("tr");
            tr.className="trdata";

            var td=document.createElement("td");
            td.innerHTML=_records[i].name;
            tr.appendChild(td);

            td=document.createElement("td");
            var strseg = _records[i].seg <10 ? "0"+_records[i].seg : _records[i].seg;
            var strmin = _records[i].min <10 ? "0"+_records[i].min : _records[i].min;
            var strhrs = _records[i].hrs <10 ? "0"+_records[i].hrs : _records[i].hrs;
            td.innerHTML=strhrs+":"+strmin+":"+strseg;
            tr.appendChild(td);

            td=document.createElement("td");
            var strLevel;
            if(_records[i].level==1)
                strLevel="Facil";
            if(_records[i].level==2)
                strLevel="Medio";
            if(_records[i].level==3)
                strLevel="Dificil";
            td.innerHTML=strLevel;
            tr.appendChild(td);

            divRecords.appendChild(tr);
        } 
        document.cookie.a

  
}
function ordenaRecords()
{
    for (var i = 0; i < _records.length; i++) {
        for (var j = i; j < _records.length; j++) 
        {
            var ri=parseInt(_records[i].hrs.toString()+_records[i].min.toString()+_records[i].seg.toString());
            var rj=parseInt(_records[j].hrs.toString()+_records[j].min.toString()+_records[j].seg.toString());

            if(ri>rj){
                var aux=_records[i];
                _records[i]=_records[j];
                _records[j]=aux;
            }            
        }
    }
}
function limpiaNombre(){
    input=document.getElementById("tNombre");
    //input.value="";
    input.style.color="#000000";
    input.select();

}
function checaNombre(){
    input=document.getElementById("tNombre");

    if(!input.value.length || input.value=="Nombre"){
        input.value="Nombre";
        input.style.color="#FF0000";
    }
}
function onClickJuega(){

    nombre= document.getElementById("tNombre");

    // checa si el campo nombre no esta vacío.
    if(!nombre.value.length || nombre.value=="Nombre")
    {
        nombre.style.color="#000"
        nombre.focus();
        nombre.select();
    }
    else{

        // Obtiene el nivel de los radio buttons
        _nivel=getNivel();

        _nombreJugador=nombre.value;

        // si no se seleccionó nivel, muestra un mensaje.
        if(!_nivel)
            alert(_nombreJugador + ", selecciona un nivel");        
        else{

            //si ya se estaba jugando, tapa todas las cartas.
            if(_isPrimerClick)
                tapaTodo();

            alert("El tiempo corre al voltear una carta.\n\n¡Suerte!");
            
            // crea el tablero con el nivel.
            creaNivel();

            // Reinicia variables
            _segundos=-1;
            _minutos=0;
            _horas=0;
            _carta1=_carta2=0;           
            _isJugando=true;
            _isPrimerClick=false;
            _parejas=0;

            // Actualiza el tiempo.
             timer();

             // si ya estaba corriendo el timer, lo para.
            if(_timerID)
                clearInterval(_timerID);
        }
        
    }
}
function onClickCarta(evt){

    //Obtiene el id de la carta seleccionada
    var nCarta=parseInt(evt.target.parentElement.id);

    // si es el primer click del juego, inicia el timer.
    if(!_isPrimerClick){
        _isPrimerClick=true;
        _timerID=setInterval(timer,1000);
    }

    // si no se estan tapando cartas (todas las cartas ocultas), checa el click de la carta.
    if(!_isTapando){

        //Si el id de la carta seleccionada es diferente al de la carta1...
        if(_carta1 != nCarta)
        {
            //si notiene carta1 aun...
            if(_carta1==0)
                _carta1=nCarta; //carta1 es la carta seleccionada
            else    // si ya tiene carta1
                _carta2=nCarta;     //carta2 es la carta seleccionada

            destapaCarta(nCarta);
            //si tiene carta1 y carta2, compara las cartas y si son iguales las bloquea.
            if(_carta2!=0)
            {
                if(comparaCartas())
                {
                    document.getElementById(""+_carta1).style.boxShadow="0px 0px 10px green";
                    document.getElementById(""+_carta2).style.boxShadow="0px 0px 10px green";
                    bloqueaCartas();
                    //Reiniciamos las cartas.
                    _carta1=0;             
                    _carta2=0;  

                    // Incrementa el numero de parejas acertadas.
                    _parejas++;

                    // si ya se encontraro todas las parejas, para el tiempo
                    // y muestra un mensaje.
                    if(_parejas ==_nCartas/2){
                        clearInterval(_timerID);
                        _timerID=0;
                        var strseg = _segundos<10 ? "0"+_segundos : _segundos;
                        var strmin = _minutos<10 ? "0"+_minutos : _minutos;
                        var strhrs = _horas<10 ? "0"+_horas : _horas;
                        alert("   ! M U Y   B I E N   " +_nombreJugador.toUpperCase()+" !\n     tu tiempo fue: " + strhrs + ":"+strmin+":"+strseg);
                        insertaRecords();
                        ordenaRecords();
                        onClickRecors();
                        onClickRecors();
                    } 
                }
                else
                {
                    //si las cartas no son iguales, muestra las cartas por 1 segundo antes de taparlas.
                    document.getElementById(""+_carta1).style.boxShadow="0px 0px 10px red";
                    document.getElementById(""+_carta2).style.boxShadow="0px 0px 10px red";
                    setTimeout(tapaCarta1,1000);
                    setTimeout(tapaCarta2,1000);

                    //se levanta la bandera de que se están tapando las cartas
                    //evita que se de click en otra carta hasta que se hayan tapado.
                    _isTapando=true;
                }                       
            }
        }
    }

}
function getNivel(){

        
    if(document.getElementById("rbNivel1").checked)
        return 1;
        
    if(document.getElementById("rbNivel2").checked)
        return 2;
        
    if(document.getElementById("rbNivel3").checked)
        return 3;

    return 0;
}
function creaNivel(){

    
    limpiaTablero();

    switch(_nivel){
        case 1:
            _nCartas = 12;
        break;

        case 2:
            _nCartas = 18;
        break;

        case 3:
            _nCartas = 24;
        break;
    }           

    llenaTablero();

    setTimeout(destapaTodo, 200);
    setTimeout(tapaTodo, 2200);
    _isTapando=true;
    
}

function llenaTablero(){
    
    //crea el arreglo con el contenedor de las cartas
    creaCartas();

    //revuelve las cartas
    revuelveCartas();

    //muestra las cartas en la página.
    muestraCartas();
}
function creaCartas(){

    //id de la carta
    var newid=1;
    //nombre de la carta (# de imagen)
    var newname=1;

    //crea el arreglo para los divs de las cartas
    _cartas= new Array(_nCartas);   

    for( i=0; i <_nCartas ;i++)
    {
        //crea una carta
        _cartas[i]=document.createElement("div");
        // le asigna la clase contenedorCarta
        _cartas[i].className="contenedorCarta";
        // le asigna su id
        _cartas[i].id=newid++;
        // le asigna su nombre
        _cartas[i].name=newname;
        // le asigna la función que se ejecuta al dar click en la carta
        _cartas[i].onclick=onClickCarta;

        // incremeneta el nombre (numero de carta) cada 2 cartas.
        if(i%2)
            newname++;              
    }
}
function muestraCartas(){
    
    //divs de cartas para la imagen principal y la imagen oculta
    var cimg1,cimg2;

    // obtenemos el div del tablero.
    var tab=document.getElementById('tab');

    // para cada elemento del arreglo de cartas...
    for (var i = 0; i < _nCartas; i++) {

        // crea una carta de imagen nueva
        cimg1=document.createElement("div");
        // le asigna la clase carta
        cimg1.className="carta";

        // crea una carta de imagen nuevaa
        cimg2=document.createElement("div");
        // le asigna la clase carta
        cimg2.className="carta";

        // a la primera carta le asigna el fondo (carta tapada)
        setImgCarta(cimg1,0);
        // a la segunda carta le asigna la imagen principal.
        setImgCarta(cimg2,parseInt(_cartas[i].name));
        
        // agrega los 2 divs de imagenes a la carta, primero la principal y encima la carta tapada.
        _cartas[i].appendChild(cimg2);
        _cartas[i].appendChild(cimg1);
        
        // agrega la carta al div del tablero.
        tab.appendChild(_cartas[i]); 
    }
}
function limpiaTablero(){

    // Obtiene el div tablero
    var tab=document.getElementById('tab');

    // Elimina todos los elementos del div (borra cartas del tablero)
    while(tab.firstChild)
        tab.removeChild(tab.firstChild);

    // si se esta jugando, elimina las cartas del div del tablero.
    for( i=0; i <_nCartas  && _isJugando;i++)
        delete _cartas[i];
    

}
function tapaCarta1(){

    var c=document.getElementById(""+_carta1);
    c.style.boxShadow="none";
    c.lastChild.className="carta";
    _carta1=0;
    if(!_carta2)
        _isTapando=false;
}
function tapaCarta2(){

    var c=document.getElementById(""+_carta2);
    c.style.boxShadow="none";
    c.lastChild.className="carta";
    _carta2=0;

    if(!_carta1)
        _isTapando=false;

}
function tapaTodo(){
    var cartas= document.getElementById("tab").childNodes;
    for (var i = 0; i < cartas.length; i++) 
        cartas[i].lastChild.className="carta";
    _isTapando=false;
    
}

function destapaTodo(){

    var cartas= document.getElementById("tab").childNodes;
    for (var i = 0; i < cartas.length; i++) 
        cartas[i].lastChild.className="cartaOver";
    
}

function comparaCartas(){
    var c1= document.getElementById(""+_carta1);
    var c2= document.getElementById(""+_carta2);

    var c1val=parseInt(c1.name);
    var c2val=parseInt(c2.name);

    if(c1val == c2val)
        return 1;

    return 0;

}

function bloqueaCartas(){

    var c1= document.getElementById(""+_carta1);
    var c2= document.getElementById(""+_carta2);

    c1.id="0";
    c2.id="0";
}
function revuelveCartas(){

    var pos1ant,pos2ant;
    var pos1,pos2;
    var cardaux;

    for (var i = 0; i < _nCartas*4; i++) {
        
        pos1=Math.floor(Math.random()*_nCartas);
        pos2=Math.floor(Math.random()*_nCartas);

        if(pos1!=pos1ant && pos2!=pos2ant)
        {
            pos1ant=pos1;
            pos2ant=pos2;
            cardaux=_cartas[pos1];
            _cartas[pos1]=_cartas[pos2];            
            _cartas[pos2]=cardaux;            
        }
    }
}

function destapaCarta(carta){

    var c=document.getElementById(carta);

    c.lastChild.className="cartaOver";
}
function timer(){

    _segundos++;

    if(_segundos==60){
        _segundos=0;
        _minutos++;

        if(_minutos==60)
        {
            _minutos=0;
            _horas++;
        }
    }

    var time=document.getElementById("txtTime");
    var strseg = _segundos<10 ? "0"+_segundos : _segundos;
    var strmin = _minutos<10 ? "0"+_minutos : _minutos;
    var strhrs = _horas<10 ? "0"+_horas : _horas;
    time.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+strhrs+":"+strmin+":"+strseg;
}
function setImgCarta(carta, num){

    
    switch(num) {
        case 0:
            carta.style.backgroundImage="url('img/backCard.png')";
        break;
        case 1:
            carta.style.backgroundImage="url('img/1.png')";
        break;
        case 2:
            carta.style.backgroundImage="url('img/2.png')";
        break;
        case 3:
            carta.style.backgroundImage="url('img/3.png')";
        break;
        case 4:
            carta.style.backgroundImage="url('img/4.png')";
        break;
        case 5:
            carta.style.backgroundImage="url('img/5.png')";
        break;
        case 6:
            carta.style.backgroundImage="url('img/6.png')";
        break;
        case 7:
            carta.style.backgroundImage="url('img/7.png')";
        break;
        case 8:
            carta.style.backgroundImage="url('img/8.png')";
        break;
        case 9:
            carta.style.backgroundImage="url('img/9.png')";
        break;
        case 10:
            carta.style.backgroundImage="url('img/10.png')";
        break;
        case 11:
            carta.style.backgroundImage="url('img/11.png')";
        break;
        case 12:
            carta.style.backgroundImage="url('img/12.png')";
        break;
    }    
}