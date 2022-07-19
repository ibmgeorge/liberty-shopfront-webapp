
const requestOne = "https://s0w1.duckdns.org:9445/catalog/items";
const requestTwo = "https://s0w1.duckdns.org:9445/phonebook/contact/";
const authHeader = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiYXVkIjoiekNFRSIsInN1YiI6InlwZ2VAYXUxLmlibS5jb20iLCJyZWFsbSI6IkFEQ0RQTCIsImlzcyI6ImxpYmVydHkiLCJleHAiOjE2ODE0Nzk0NjksImlhdCI6MTU4MTQ3MjI2OX0.KJlE-wS1N48cWz1F1uDxpSN7uR9fb4uFGxY3o31OxuoQRFjYTXiaadeDzhmBrz0LK30bdi2oGZlfs0DEhFIkC8iwJlKRS4-bMudTLK37E_UW6T6EhjFmO-X8DUNJeiKVEz0rc982QFoGQLCm7T7-YT7HNqId2RFPe1JKWebJfH-zepME-R6CNpsu7f3ZWnJsopCz2ewuOtt72xtozf6ZnAXTUM46bp60vUbh7btha8C9XNHxq2pIKOJ6sJfcWjqjhA9M7oMRVYO_ml6Gpk6iRL_0HagMytjVEg6Veu7888f4K5IzQJaNQUTFVqE3S17o7Wn8dcCApf8D3CqM78WHag"

function listCICSItems(requestUrl) {
    fetch(requestUrl,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": authHeader
            }
        })
        .then(res => res.json())
        .then((data) => {
            $('#items-table > tbody').empty();
            data["cics-data"].inventory.items.forEach((itemObj) => {
                $('#items-table').append($('<tr>')
                    .append($('<th>').append(itemObj.id))
                    .append($('<td>').append(itemObj.desc))
                    .append($('<td>').append(itemObj.cost))
                    .append($('<td>').append(itemObj["in-stock"]))
                );
            }
            );
            $('#btnLoadCICS').text('Get CICS Catalog Items').removeClass('disabled');
            $('#cics-footnote').text(new Date());
        })
}

function listIMSItems(requestUrl) {
    requestUrl += $('#lastName').val().trim().toUpperCase();
    fetch(requestUrl,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": authHeader
            }
        })
        .then(res => res.json())
        .then((data) => {
            $('#contact-table > tbody').empty();
            itemObj = data["IVTNO_OUTPUT_MSG"];
            $('#contact-table > tbody').append($('<tr>'))
                .append($('<th>').append(itemObj["OUT_FIRST_NAME"]))
                .append($('<td>').append(itemObj["OUT_LAST_NAME"]))
                .append($('<td>').append(itemObj["OUT_EXTENSION"]))
                .append($('<td>').append(itemObj["OUT_ZIP_CODE"]));
            $('#btnLoadIMS').text('Lookup IMS').removeClass('disabled');
            $('#ims-footnote').text("IMS MESSAGE: " + itemObj["OUT_MESSAGE"] + " @" + new Date());
        })
}
var timer = null;
$(function () {
    $('#btnLoadCICS').click(function () {
        $('#btnLoadCICS').text('Loading').addClass('disabled');
        listCICSItems(requestOne);
    });
    $('#btnLoadIMS').click(function () {
        $('#btnLoadIMS').text('Loading').addClass('disabled');
        listIMSItems(requestTwo);
    });
    $('#switchRobot').click(function () {
        var act = $('#switchRobot').prop('checked');
        console.log("Robot status " + act);
        if (act) {
            timer = setInterval(() => {
                if (Math.random()<0.3)
                    $('#btnLoadIMS').click();
                else
                    $('#btnLoadCICS').click();
            }, 1000);
        } else
            clearInterval(timer);
    })
});

