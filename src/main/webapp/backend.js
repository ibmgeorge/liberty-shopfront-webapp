
const catalogUrl = "https://s0w1.duckdns.org:9445/catalog/items";
const requestSingleUrl = "https://s0w1.duckdns.org:9445/catalog/item/";
const authHeader = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiYXVkIjoiekNFRSIsInN1YiI6InlwZ2VAYXUxLmlibS5jb20iLCJyZWFsbSI6IkFEQ0RQTCIsImlzcyI6ImxpYmVydHkiLCJleHAiOjE2ODE0Nzk0NjksImlhdCI6MTU4MTQ3MjI2OX0.KJlE-wS1N48cWz1F1uDxpSN7uR9fb4uFGxY3o31OxuoQRFjYTXiaadeDzhmBrz0LK30bdi2oGZlfs0DEhFIkC8iwJlKRS4-bMudTLK37E_UW6T6EhjFmO-X8DUNJeiKVEz0rc982QFoGQLCm7T7-YT7HNqId2RFPe1JKWebJfH-zepME-R6CNpsu7f3ZWnJsopCz2ewuOtt72xtozf6ZnAXTUM46bp60vUbh7btha8C9XNHxq2pIKOJ6sJfcWjqjhA9M7oMRVYO_ml6Gpk6iRL_0HagMytjVEg6Veu7888f4K5IzQJaNQUTFVqE3S17o7Wn8dcCApf8D3CqM78WHag"
const accountList = ["A1234567", "A7654321", "A0000000"];
const lastNameList = ["GE", "MATTINGLY", "LNAME"];

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
            $('#items-table > tbody').fadeOut().empty();
            data["cics-data"].inventory.items.forEach((itemObj) => {
                $('#items-table').append($('<tr id=' + itemObj.id + '>')
                    .append($('<th>').append(itemObj.id))
                    .append($('<td>').append(itemObj.desc))
                    .append($('<td>').append(itemObj.cost))
                    .append($('<td>').append(itemObj["in-stock"]))
                );
            }
            );
            $('#items-table > tbody').fadeIn();
            $('#btnLoadCICS').text('Refresh CICS Catalog').removeClass('disabled');
            $('#cics-footnote').text(new Date());
        })
}

function updateSingleItem(id) {
    fetch(requestSingleUrl + id,
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
            $('#items-table > tbody > tr').removeClass("table-primary");
            $('#' + id).fadeOut().fadeIn().addClass("table-primary");
        })
}

var timer = null;
$(function () {
    $('#btnLoadCICS').click(function () {
        $('#btnLoadCICS').text('Loading').addClass('disabled');
        listCICSItems(catalogUrl);
    });
    $('#switchRobot').click(function () {
        var act = $('#switchRobot').prop('checked');
        console.log("Robot status " + act);
        if (act) {
            timer = setInterval(() => {
                var i = Math.floor(Math.random() * 100);
                if (i <= 30) {
                    update("phonebookServlet?lname=" + lastNameList[i % lastNameList.length], $('#imsMessage'));
                    ineum('user', lastNameList[i % lastNameList.length], null, null);
                } else if (i <= 60)
                    update("accountServlet?account=" + accountList[i % accountList.length], $('#cicsMessage'));
                else {
                    items = $('#items-table > tbody > tr');
                    selected = $(items[Math.floor(Math.random() * items.length)]).attr("id");
                    updateSingleItem(selected);
                }
            }, 2000);
        } else
            clearInterval(timer);
    });
    listCICSItems(catalogUrl);
    update("phonebookServlet?lname=GE", $('#imsMessage'));
    update("accountServlet?account=A1234567", $('#cicsMessage'));
});

function update(url, obj) {
    fetch(url /*, options */)
        .then((response) => response.text())
        .then((html) => {
            obj.addClass("table-primary");
            obj.fadeOut().html(html).fadeIn();
            obj.removeClass("table-primary");
        })
        .catch((error) => {
            console.warn(error);
        });
} 