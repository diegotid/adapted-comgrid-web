
var gridURL = null;
var gridJSON = null;
var voiceLang = 'Spanish Female';

var apiURL = 'https://www.googleapis.com/customsearch/v1';
var apiKey = 'AIzaSyCNPpm7l0ux6guKdP04mVtOKDc0ta7rlaI';
var cseId = '000035554816196296110:duvthbrcfcm';

function setupGrid(url) {
    gridURL = url;
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

function reloadGrid(node) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            gridJSON = JSON.parse(request.responseText);
            var json = findNode(gridJSON, node);
            if (json != null) {
                fillGrid(json);
            }
        }
    }
    request.open('GET', gridURL);
    request.send();
}

function findNode(json, id) {
    var node = null;
    if (json['id'] == id) {
        return json;
    }
    if (json['items']) {
        json['items'].forEach(function(item) {
            var sub = findNode(item, id);
            if (sub != null) {
                node = sub;
            }
        });
    }
    return node;
}

function fillGrid(json, page) {
    if (!page) page = 1;
    var path = json['id'].split('-');
    path.pop();
    console.log('Page: ' + page);
    console.log('Items length: ' + json['items'].length);
    console.log('Path length: ' + path.length);
    document.querySelector('#parent').value = json['id'];
    var grid = document.querySelector('.grid');
    grid.innerHTML = '';
    if (json['items']) {
        var i = 0;
        json['items'].forEach(function(item) {
            i++;
            if (i <= 3 * (page - 1)) {
                return; // continue forEach to reach the page
            }
            if (i > 3 * page && (path.length > 0 || json['items'].length > 4)) {
                return; // continue forEach not to show non visible items
            }
            var a = document.createElement('a');
            var li = document.createElement('li');
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
            var admin = document.createElement('ul');
            admin.classList.add('admin');
            li.appendChild(admin);
            var edit = document.createElement('li');
            edit.innerText = 'cambiar';
            edit.addEventListener('click', function() {
                showSelectPic(item);
            });
            admin.appendChild(edit);
            var add = document.createElement('li');
            if (item['items']) {
                if (item['items'].length > 0) {
                    add.innerText = item['items'].length + ' opciones';
                    add.addEventListener('click', function() {
                        fillGrid(item);
                    });
                } else {
                    add.innerText = 'añadir opciones';
                    add.addEventListener('click', function() {
                        treeUntree(item, true);
                    });
                    treeUntree(item, false);
                }
            } else {
                add.innerText = 'añadir opciones';
                add.addEventListener('click', function() {
                    treeUntree(item, true);
                });
            }
            admin.appendChild(add);
            var remove = document.createElement('li');
            remove.innerText = 'eliminar';
            remove.addEventListener('click', function() {
                removeNode(item);
            });
            admin.appendChild(remove);
        });
    }
    for (var i = grid.childNodes.length; i < 4 - (json['items'].length > 3 * page || path.length > 0 || page > 1) ? 1 : 0; i++) {
        var li = document.createElement('li');
        grid.appendChild(li);
    }
    if (json['items'].length > 3 * page) {
        var a = document.createElement('a');
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = '/comgrid/pics/next.png';
        a.appendChild(img);
        a.addEventListener('click', function(e) {
            fillGrid(json, page + 1);
        });
        li.appendChild(a);
        grid.appendChild(li);
    } else if (path.length > 0 || page > 1) {
        var back = null;
        path.forEach(function(index) {
            if (!back) {
                back = gridJSON;
            } else {
                back = back['items'][index];
            }
        });
        var a = document.createElement('a');
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = '/comgrid/pics/no.png';
        a.appendChild(img);
        if (path.length > 0) {
            a.addEventListener('click', function(e) {
                fillGrid(back);
            });
        } else {
            a.addEventListener('click', function(e) {
                fillGrid(json);
            });
        }
        li.appendChild(a);
        grid.appendChild(li);
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

function treeUntree(item, follow) {
    var selected = encodeURIComponent(item['id']);
    var request = new XMLHttpRequest();
    if (follow) {
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                fillGrid(item);
            }
        }
    }
    request.open('POST', '/comgrid/update.php?id=' + selected);
    request.send();
}

function removeNode(item) {
    var question = '¿Estás completamente seguro de querer eliminar "' + item['title'] + '"';
    if (item['items']) {
        question += ' y sus ' + item['items'].length + ' opciones';
    }
    question += '?';
    if (confirm(question)) {
        var parent = document.querySelector('#parent').value;
        var selected = encodeURIComponent(item['id']);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                reloadGrid(parent);
            }
        }
        request.open('POST', '/comgrid/update.php?remove=' + selected);
        request.send();
    }
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
            reloadGrid(parentValue);
            closeSelect();
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