function getTeams(url, func) {
    $.ajax({
        url: url,
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
                        if (positions[index] === 'gm-im') {
                            team.gm = column.text().split('-')[0];
                            team.im = column.text().split('-')[1];
                        } else {
                            team[positions[index]] = column.text();
                        }
                    }
                });
                if (team.lag) {
                    teams.push(team);
                }
            });
            func(teams);
        }
    });
}

function createTable(teams, sortKey, container, logos, reverse) {

    teams.sort(function(first, second) {
        a = parseInt(first[sortKey], 10);
        b = parseInt(second[sortKey], 10);
        if (isNaN(a)) {
            a = first[sortKey];
            b = second[sortKey];
        }

        if (typeof a === 'number') {
            if (a < b) {
                return reverse ? -1 : 1;
            }
            if (a > b) {
                return reverse ? 1 : -1;
            }
            return 0;
        }
        if (a < b) {
            return reverse ? 1 : -1;
        }
        if (a > b) {
            return reverse ? -1 : 1;
        }
        return 0;
    });

    sorted = teams;

    var table = $('<table></table>');
    table.addClass('table');
    var headRow = $('<tr></tr>');
    table.append(headRow);
    headRow.append($('<td></td>'));

    $.each(teams[0], function(key, value) {
        var column = $('<th></th>');
        headRow.append(column);
        column.attr('tabindex', tabindex);
        tabindex++;
        column.text(key.toUpperCase());
        if (key === sortKey) {
            focusedColumn = column;
            column.addClass('th-selected');
        }
        function update() {
            table.remove();
            createTable(teams, key, container, logos, key === sortKey && !reverse);
        }
        column.on('click', function() {
            update();
        });
        column.on('keypress', function(event) {
            if (event.keyCode === 13) {
                update();
            }
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
            var name = $('<p/>');
            name.css({
                'display': 'inline-block',
                'margin': '8px 0px'
            });
            name.text(value);
            column.append(name);
           
            if (key === 'lag') {
                var width = 25;
                var bgsize = width * logos.positions.length;

                var left = -1 * width *  logos.positions.indexOf(
                    value.toLowerCase().trim());
                var logo = $('<div></div>');
                column.prepend(logo);
                logo.css({
                    float: 'left',
                    width: width + 'px',
                    height: width,
                    margin: '5px 5px 0 0',
                    'background-size': bgsize, 
                    'background-image': 'url(' + logos.url + ')',
                    'background-position': left + 'px ' + -1 * width + 'px'
                });
            }
            
            row.append(column);
            if (key === sortKey) {
                column.addClass('td-selected');
            }
        });
    });

    container.append(table);
    focusedColumn.focus();
}

$(function() {
    tabindex = 1;
    logos = {};
    logos.positions = [
        'ängelholms ff', 'assyriska ff', 'östersunds fk', 'ik brage',
        '', 'degerfors if', 'falkenbergs ff', 'hammarby if',
        'jönköpings södra if', 'landskrona bois', 'ljungskile', '',
        'örgryte is', 'gif sundsvall', 'ifk värnamo', 'örebro sk', '',
        'gais', '', 'varbergs bois fc'  
    ];
    logos.url = '/images/superettan.png';

    getTeams('/scripts/superettan.php', function(teams) {
        createTable(teams, 'p', $('#superettan'), logos);
    });

    asLogos = {};
    asLogos.positions = [
        'aik', 'djurgården', 'if elfsborg', '', '', 'bk häcken',
        'halmstads bk', 'helsingborgs if', 'ifk göteborg',
        'kalmar ff', 'malmö ff', 'mjällby aif', 'ifk norrköping',
        '', 'syrianska fc', 'östers if', 'if brommapojkarna',
        'åtvidabergs ff' 
    ];
    asLogos.url = '/images/allsvenskan.png';
    getTeams('/scripts/allsvenskan.php', function(teams) {
        createTable(teams, 'p', $('#allsvenskan'), asLogos);
    });
});
