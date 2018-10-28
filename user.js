
var gridJSON = null;
var voiceLang = 'Spanish Female';

var apiURL = 'https://www.googleapis.com/customsearch/v1';
var apiKey = 'AIzaSyCNPpm7l0ux6guKdP04mVtOKDc0ta7rlaI';
var cseId = '000035554816196296110:duvthbrcfcm';

function setupGrid(gridURL) {
    if (!gridJSON) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                gridJSON = JSON.parse(request.responseText);
                fillGrid(gridJSON);
            }
        }
        request.open('GET', gridURL);
        request.send();
    }
    var control = document.querySelector('#control');
    var body = document.querySelector('body');
    control.addEventListener('click', function() {
        if (body.classList.contains('editing')) {
            body.classList.remove('editing');
        } else {
            body.classList.add('editing');
        }
    });
    document.querySelector('#add').addEventListener('click', showAddPic);
    setupSelect();
}

function fillGrid(json) {
    document.querySelector('#parent').value = json['id'];
    var grid = document.querySelector('.grid');
    grid.innerHTML = '';
    json['items'].forEach(function(item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var img = document.createElement('img');
        img.src = item['pic'];
        a.appendChild(img);
        li.appendChild(a);
        li.id = item['id'];
        grid.appendChild(li);
        a.addEventListener('click', function(e) {
            responsiveVoice.speak(item['title'], voiceLang);
            if (item['items']) {
                fillGrid(item);
            }
        });
        var edit = document.createElement('div');
        var pen = document.createElement('img');
        pen.src = 'edit.png';
        edit.appendChild(pen);
        edit.classList.add('edit');
        li.appendChild(edit);
        pen.addEventListener('click', function() {
            showSelectPic(item);
        });
        var add = document.createElement('div');
        var tree = document.createElement('img');
        if (item['items']) {
            tree.src = 'untree.png';
        } else {
            tree.src = 'tree.png';
        }
        add.appendChild(tree);
        add.classList.add('add');
        li.appendChild(add);
        tree.addEventListener('click', function() {
            treeUntree(item);
        });
    });
    var path = json['id'].split('-');
    path.pop();
    document.querySelector('#add').disabled = true;
    for (var i = grid.childNodes.length + (path.length > 0 ? 1 : 0); i < 4; i++) {
        document.querySelector('#add').disabled = false;
        var li = document.createElement('li');
        grid.appendChild(li);
    }
    if (path.length > 0) {
        var back = null;
        path.forEach(function(index) {
            if (!back) {
                back = gridJSON;
            } else {
                back = back['items'][index];
            }
        });
        var li = document.createElement('li');
        var a = document.createElement('a');
        var img = document.createElement('img');
        img.src = '/comgrid/pics/no.png';
        a.appendChild(img);
        li.appendChild(a);
        grid.appendChild(li);
        a.addEventListener('click', function(e) {
            fillGrid(back);
        });
    }
}

function setupSelect() {
    var concepto = document.querySelector('#concepto');
    concepto.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            selectSearch();
        }
    });
    var close = document.querySelector('#close');
    close.addEventListener('click', closeSelect);
    document.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 27) { // 13 is escape
            closeSelect();
        }
    });
}

function showSelectPic(item) {
    document.querySelector('#' + item['id']).classList.add('selected');
    document.querySelector('#select').classList.add('active');
    document.querySelector('#concepto').value = item['title'];
    document.querySelector('#selected').value = item['id'];
    selectSearch();
}

function showAddPic() {
    document.querySelector('#select').classList.add('active');
}

function treeUntree(item) {
    var selected = encodeURIComponent(item['id']);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            if (item['items']) {
                location.reload();
            } else {
                item['items'] = [];
                fillGrid(item);
            }
        }
    }
    request.open('POST', '/comgrid/update.php?id=' + selected);
    request.send();
}

function closeSelect() {
    document.querySelector('#select').classList.remove('active');
    var items = document.querySelectorAll('.grid li');
    items.forEach(function(item) {
        item.classList.remove('selected');
    });
    var concepto = document.querySelector('#concepto');
    concepto.value = ''
    document.querySelector('#select').classList.remove('active');
        item.classList.remove('selected');
    var resultados = document.querySelector('#resultados');
    resultados.innerHTML = '';
    var body = document.querySelector('body');
    body.classList.remove('editing');
}

function updateSelected(image) {
    var parent = document.querySelector('#parent');
    var selected = document.querySelector('#selected');
    var concepto = document.querySelector('#concepto');
    parentValue = encodeURIComponent(parent.value);
    selectedValue = encodeURIComponent(selected.value);
    conceptoValue = encodeURIComponent(concepto.value);
    image = encodeURIComponent(image['link']);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            location.reload(true);
        }
    }
    if (selected.value.length > 0) {
        request.open('POST', '/comgrid/update.php?id=' + selectedValue + '&voice=' + conceptoValue + '&image=' + image);
        selected.value = '';
    } else {
        request.open('POST', '/comgrid/update.php?parent=' + parentValue + '&voice=' + conceptoValue + '&image=' + image);
        parent.value = '';
    }
    request.send();
}

function selectSearch(desde) {
    var concepto = document.querySelector('#concepto');
    document.querySelector('#loading').classList.add('on');
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            document.querySelector('#loading').classList.remove('on');
            if (request.status == 200) {
                var response = JSON.parse(request.responseText);
                var resultados = document.querySelector('#resultados');
                if (!desde || desde == 0) {
                    resultados.innerHTML = '';
                }
                response['items'].forEach(function(imagen) {
                    var elemento = document.createElement('li');
                    var img = document.createElement('img');
                    img.src = imagen['image']['thumbnailLink'];
                    elemento.appendChild(img);
                    resultados.appendChild(elemento);
                    elemento.addEventListener('click', function() {
                        updateSelected(imagen);
                    });
                });
                if (!desde || desde < 100) {
                    var elemento = document.createElement('li');
                    elemento.classList.add('otros');
                    elemento.innerHTML = 'Otros';
                    elemento.addEventListener('click', function() {
                        resultados.removeChild(elemento);
                        selectSearch(desde ? desde + 10 : 10);
                    });
                    resultados.appendChild(elemento);
                }
            }
        }
    }
    var url = apiURL + '?cx=' + encodeURIComponent(cseId);
    url += '&key=' + encodeURIComponent(apiKey);
    url += '&searchType=image';
    if (desde) {
        url += '&start=' + desde;
    }
    request.open('GET', url + '&q=' + concepto.value);
    request.send();
}