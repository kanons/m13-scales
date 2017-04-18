/* Create a barchart of drinking patterns*/
$(function() {
    // Read in prepped_data file
    d3.csv('data/prepped_data.csv', function(error, allData) {
        // Track the sex (male, female) and drinking type (any, binge) in variables
        var sex = 'female';
        var type = 'binge';

        // Margin: how much space to put in the SVG for axes/titles
        var margin = {
            left: 70,
            bottom: 100,
            top: 50,
            right: 50
        };

        // Height and width of the total area
        var height = 600;
        var width = 1000;

        // Height/width of the drawing area for data symbols
        var drawHeight = height - margin.bottom - margin.top;
        var drawWidth = width - margin.left - margin.right;

        // Select SVG to work with, setting width and height (the vis <div> is defined in the index.html file)
        var svg = d3.select('#vis')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        // Append a 'g' element in which to place the rects, shifted down and right from the top left corner
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        // Append an xaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        // Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        // Append text to label the y axis (don't specify the text yet)
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
            .attr('class', 'title');

        // Append text to label the y axis (don't specify the text yet)
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        


        // Add tip
        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d.state_name;
        });
        g.call(tip);

       

        //function to filter down your data to the current selection based on the current sex and type
        var filterData = function() {
            // Filter data down
            var data = allData.filter(function(d) {
                return d.type == type && d.sex == sex
            })
            // Sort the data alphabetically
            // Hint: http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
            .sort(function(a, b) {
                if (a.state_name < b.state_name) return -1;
                if (a.state_name > b.state_name) return 1;
                return 0;
            });
        }
        
        //function for setting the scales based on the current data selection
        var setScales = function(data) {
            // Get the unique values of states for the domain of your x scale
            var states = data.map(function(d) {
                return d.state;
            });

            // Define an xScale with d3.scaleBand. Domain/rage will be set in the setScales function.
            // Set the domain/range of your xScale
            xScale = d3.scaleBand()
                .range([0, drawWidth])
                .padding(0.1)
                .domain(states);

            // Get min/max values of the percent data (for your yScale domain)
            var yMin = d3.min(data, function(d) {
                return +d.percent;
            });

            var yMax = d3.max(data, function(d) {
                return +d.percent;
            });
                      

            // Define a yScale with d3.scaleLinear. Domain/rage will be set in the setScales function.
            // Set the domain/range of your yScale
            yScale = d3.scaleLinear()
                .range([drawHeight, 0])
                .domain([0, yMax]);

        }

        //function for updating your axis elements (both the axes, and their labels)
        var setAxes = function() {
            // Define xAxis using d3.axisBottom(). Scale will be set in the setAxes function.
            var xAxis = d3.axisBottom()
                .scale(xScale);

            // Define yAxis using d3.axisLeft(). Scale will be set in the setAxes function.
            var yAxis = d3.axisLeft()
                .scale(yScale)
                .tickFormat(d3.format('.2s'));

            // Render (call) your xAxis in your xAxisLabel
            xAxisLabel.call(xAxis);

            // Render (call) your yAxis in your yAxisLabel
            yAxisLabel.call(yAxis);

            // Update xAxisText and yAxisText labels
            xAxisText.text('State');
            yAxisText.text('Percent Drinking (' + sex + ', ' + type + ')');
        }

        //function to perform your data-join. Within this function you should set your scales, update your axes, and re-render your rectangles
        var draw = function(data) {
            setScales(data);

            setAxes();

            // Store the data-join in a function: make sure to set the scales and update the axes in your function.
            // Select all rects and bind data
            var bars = g.selectAll('rect').data(data);

            // Use the .enter() method to get your entering elements, and assign initial positions
            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.state);
                })
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr('width', xScale.bandwidth())
                .attr('y', function(d) {
                    return yScale(d.percent);
                })
                .attr('height', function(d) {
                    return drawHeight - yScale(d.percent);
                });
        }
        //Assign an event handler to your input elements to set the sex and/or type, filter your data, then update your chart.
    });
});