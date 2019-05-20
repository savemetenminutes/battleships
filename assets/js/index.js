function getCheckedRadio(name, source)
{
    source = source || document;
    let checkboxes = source.getElementsByName(name);
    for(let i=0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) {
            return checkboxes[i];
        }
    }

    return false;
}

function getFormData(form)
{
    let query = [];
    let inputs = form.getElementsByTagName('input');
    let textareas = form.getElementsByTagName('textarea');
    let selects = form.getElementsByTagName('select');

    let checkboxes = [];
    let radios = [];
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].name) {
            if (!inputs[i].disabled) {
                switch (inputs[i].type.toLowerCase()) {
                    case 'hidden' :
                    case 'text' :
                        query[inputs[i].name] =  inputs[i].value;
                        break;
                    case 'radio' :
                        radios[inputs[i].name] = inputs[i];
                        break;
                    case 'checkbox' :
                        checkboxes[inputs[i].name] = inputs[i];
                        break;
                }
            }
        }
    }

    radios = radios.values();
    checkboxes = checkboxes.values();

    for (const i of radios) {
        query[radios.name] = getCheckedRadio(radios.name).value;
    }
    for (let i =0; i < checkboxes.length; i++) {
        query[checkboxes[i].name] = [];
        if (checkboxes[i].checked) {
            query[checkboxes[i].name].push(checkboxes[i].value);
        }
    }
    for (let i = 0; i < textareas.length; i++) {
        if (textareas[i].name) {
            if (!textareas[i].disabled) {
                query[textareas[i].name] = textareas[i].value;
            }
        }
    }
    for (let i = 0; i < selects.length; i++) {
        if (selects[i].name) {
            if (!selects[i].disabled) {
                query[selects[i].name] = selects[i].value;
            }
        }
    }

    return query;
}

function togglePositionHighlight(coordinates, className, event)
{
    let dx = coordinates[0]['x'];
    let dy = coordinates[0]['y'];
    if(document.getElementById('cell-' + dx + '-' + dy).className.match(new RegExp('\\s*' + className))) {
        unhighlightPosition(coordinates, className, event);
    } else {
        highlightPosition(coordinates, className, event)
    }
}

function highlightPosition(coordinates, className, event)
{
    coordinates.forEach(
        function (element) {
            let dx = element['x'];
            let dy = element['y'];
            document.getElementById('cell-' + dx + '-' + dy).className = document.getElementById('cell-' + dx + '-' + dy).className.replace(new RegExp('\\s*' + className), '') + ' ' + className;
        }
    );
}

function unhighlightPosition(coordinates, className, event)
{
    coordinates.forEach(
        function (element) {
            let dx = element['x'];
            let dy = element['y'];
            document.getElementById('cell-' + dx + '-' + dy).className = document.getElementById('cell-' + dx + '-' + dy).className.replace(new RegExp('\\s*' + className), '');
        }
    );
}

const config = {
    x: 10,
    y: 10,
    ships: (new Array(6)).fill(2, 4).fill(1, 5),
    positioning: {
        rotationAngles: [0, 11, 22, 34, 45, 56, 68, 79, 90, 101, 112, 124, 135, 146, 158, 169, 180, 191, 202, 214, 225, 236, 248, 259, 270, 281, 292, 304, 315, 326, 338, 349], // some optimization wouldn't hurt anyone :)
    },
    debug: {
        log: {
            getRandomPositions: false,
            filterOutPositionCollisions: false,
            place: false,
            getRandomPosition: false,
        },
        console: {
            filterOutPositionCollisions: false,
        },
    }
};

let bs = new Battle(config); // :)
bs.restart();

