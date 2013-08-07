teams = [];


function getTeams() {
    $.ajax({
        url: '/read.php',
        success: function (res) {
            teams = [];
            positions = ['lag', 'm', 'v', 'o', 'f', 'gm-im', '+/-', 'p']; 

            table = $(res).find('.matchtable').first();
            $.each(table.find('tr'), function() {
                var row = $(this);
                var team = {};
                $.each(row.find('td'), function(index) {
                    var column = $(this);
                    if (index < positions.length) {
                        team[positions[index]] = column.text();
                    }
                });
                if (team.lag) {
                    teams.push(team);
                }
            });
            createTable(teams, 'p');
        }
    });
}

function createTable(teams, sortKey) {
    if (sortKey === undefined) {
        sortkey = 'p';
    }

    console.log('Sorting by: ' + sortKey);
    teams.sort(function(first, second) {
        a = parseInt(first[sortKey]);
        b = parseInt(second[sortKey]);
        if (isNaN(a)) {
            a = first[sortKey];
            b = second[sortKey];
        }
        if (a < b) {
            return typeof a === 'number' ? 1 : -1;
        }
        if (a > b) {
            return typeof a === 'number' ? -1 : 1;
        }
        return 0;
    });

    sorted = teams;

    var table = $('<table></table>');
    table.addClass('table');
    var headRow = $('<tr></tr>');
    table.append(headRow);
    headRow.append($('<th></th>'));
    $.each(teams[0], function(key, value) {
        var column = $('<th></th>');
        headRow.append(column);
        column.text(key.toUpperCase());
        if (key === sortKey) {
            column.addClass('th-selected');
        }
        column.on('click', function() {
            table.remove();
            createTable(teams, key);
        });
    });
    $.each(teams, function(index) {
        var row = $('<tr></tr>');
        table.append(row);
        if (index % 2) {
            row.addClass('tr-even');
        } else {
            row.addClass('tr-odd');
        }
        var position = $('<td></td>');
        row.append(position);
        position.text(index+1);
        $.each(this, function(key, value) {
            var column = $('<td></td>');
            column.text(value);
            row.append(column);
            if (key === sortKey) {
                column.addClass('td-selected');
            }
        });
    });
    $('body').append(table);
}

$(function() {
    getTeams();
});
