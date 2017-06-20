module.exports = function (fieldvalue) {
    if (fieldvalue != undefined || fieldvalue == "yes") {
        return '<td>' +
            '<a href="/employees/edit/{{this._id}}"><img class="img-circle emplist_imgwidth" src="/images/edit.jpg" alt="Edit Employee"/></a>' +
            '<a href="/employees/delete/{{this._id}}"><img class="img-circle emplist_imgwidth" src="/images/delete.jpg" alt="Delete Employee"/></a>' +
            '</td>';
    }
    else {
        // return '<td>' +
        //     '<a disabled href="/employees/edit/{{this._id}}"><img class="img-circle emplist_imgwidth" src="/images/edit.jpg" alt="Edit Employee"/></a>' +
        //     '<a disabled href="/employees/delete/{{this._id}}"><img class="img-circle emplist_imgwidth" src="/images/delete.jpg" alt="Delete Employee"/></a>' +
        //     '</td>'
        return '<td>data</td>';
    }
}