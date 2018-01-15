function drawChart() {
            // Define the chart to be drawn.
            var data = google.visualization.arrayToDataTable([
               ['Year', 'Asia', 'Europe'],
               ['2013',  1000,      400],
               ['2014',  1170,      460],
               ['2015',  1300,       480],
               ['2016',  1530,      540]
            ]);

            var options = {title: 'Population (in millions)',
               hAxis: {title: 'Year', titleTextStyle: {color: '#333'}},
               vAxis: {minValue: 0},
               isStacked: true
            };  

            // Instantiate and draw the chart.
            var chart = new google.visualization.AreaChart(document.getElementById('chart_google'));
            chart.draw(data, options);
         }
google.charts.setOnLoadCallback(drawChart);