<html>
    <head>
        <link rel="stylesheet" href="styles.css?update=<?php echo date('YmdHis');?>">
        <script type="text/javascript" src="user-min.js?update=<?php echo date('YmdHis');?>"></script>
        <link href="https://fonts.googleapis.com/css?family=Hind:300,500" rel="stylesheet">
    </head>
    <body onload="setupGrid('/comgrid/grid.json?update=<?php echo date('YmdHis');?>')">
        <ul class="grid">
        </ul>
        <div id="control">
            <button id="cancel">Cancelar</button>
            <img src="tile.png"/>
            <button id="add">A&ntilde;adir</button>
        </div>
        <div id="select">
            <img src="close.png" id="close"/>
            <div>
                <input type="text" id="concepto" placeholder="Descripción de la imagen a buscar"/>
                <input type="file" id="imagen"/>
                <div id="title"></div>
                <input type="hidden" id="selected"/>
                <input type="hidden" id="parent"/>
                <img src="loading.gif" id="loading"/>
                <button id="settitle">Cambiar título</button>
                <button id="search">Buscar imagen</button>
                <ul id="resultados"></ul>
            </div>
        </div>
    </body>
    <script src="voice.js"></script>
</html>