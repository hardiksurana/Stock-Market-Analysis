var rows = <%-JSON.stringify(data)%>;
var x_axis = Object.keys(rows[0])[1];
console.log(x_axis);

var y_axis = Object.keys(rows[0])[0];
console.log(y_axis);

var data =
[{
    // set the x-data
    x:  rows.map(function(row) {
            return JSON.stringify((row[x_axis].split("T"))[0]);
        }),

    // set the y-data
    y:  rows.map(function(row) {
            return JSON.stringify(row[y_axis]);
        })
}];

// Layout Styling
var layout = {
    xaxis: {
        title: 'Date',
        tickformat: "%B, %Y"
    },
    yaxis: {
        title: y_axis,
        type: 'log'
    },
    margin: {
        t: 20
    },
    hovermode: 'closest',
    autosize: true,
    width: 1275,
    height: 600,
    margin: {
        l: 75, r: 75, b: 100, t: 50, pad: 0
    }
}

Plotly.newPlot(document.getElementById('plotGraph'), data, layout);
