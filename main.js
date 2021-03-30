// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575; 

let svg1 = d3.select("body")  
    .append("svg") 
    .attr("width", graph_1_width)
    .attr("height", graph_1_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  

    let countRef1 = svg1.append("g");

d3.csv("../data/football.csv").then(function(data) {
    
    data = cleanData1(data);
    let arr = data.map(function(d){return d['count']});
    let arr2 = data.map(function(d){return d['year']});
    
    let max = d3.max(arr)
    let min = d3.min(arr)

    let x = d3.scaleLinear()
        .domain([2011, 2020])
        .range([0, graph_1_width - margin.left - margin.right]);
    
    svg1.append("g")
        .attr("transform", `translate(0, ${graph_1_height*.68})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickSize(3).tickPadding(10));

    let y = d3.scaleLinear()
        .domain([max, min])
        .range([0, graph_1_height - margin.top - margin.bottom]);

    svg1.append("g")
        .call(d3.axisLeft(y).tickSize(3));

    var area = d3.area()
    .x(function(d) { return x(d.year); })
    .y0(graph_1_height - 80)
    .y1(function(d) { return y(d.count); });   
    
    svg1.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", d3.color("lightblue") );

    svg1.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "midnightblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.count) }));        

    let counts = countRef1.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(d['count']) + 5})
        .attr("y", function(d) { return y(d['year']) + 12})
        .style("text-anchor", "start")
        .text(function(d) { return d['count']});  

    svg1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, ${graph_1_height - margin.bottom - margin.top + 40})`)       
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Year");

    svg1.append("text")
        .attr("transform", `translate(-110, ${(graph_1_height - margin.bottom - margin.top)/ 2})`)       
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Count");

    svg1.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right)/2}, -25)`)       
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Number of International Football Matches in Recent Years");
});

let svg2 = d3.select("body")  
    .append("svg") 
    .attr("width", graph_2_width)
    .attr("height", graph_2_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  
    let countRef2 = svg2.append("g");

d3.csv("../data/football.csv").then(function(data) {
    data = cleanData2(data)

    let arr = data.map(function(d){return d['win_pct']});
    let arr2 = data.map(function(d){return d['team']}); 

    let max = d3.max(arr)  


    let x = d3.scaleLinear()
        .domain([0, max])
        .range([0, graph_2_width - margin.left - margin.right]);

    
    let y = d3.scaleBand()
        .domain(arr2)
        .range([0, graph_2_height - margin.top - margin.bottom])
        .padding(0.1); 

    
    svg2.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg2.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["team"] }))
        .range(d3.quantize(d3.interpolateHcl("#165816", "#52D452"), 10));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['team']) })
        .attr("x", x(0))
        .attr("y", function(d) { return y(d['team'])})
        .attr("width", function(d) {return x(d['win_pct'])})
        .attr("height",  y.bandwidth());        
    
    let counts = countRef2.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(d['win_pct']) + 5})
        .attr("y", function(d) { return y(d['team']) + 12})
        .style("text-anchor", "start")
        .text(function(d) { return d['win_pct']});  

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - margin.bottom - margin.top + 20})`)       
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Winning Percentage");

    svg2.append("text")
        .attr("transform", `translate(-110, ${(graph_2_height - margin.bottom - margin.top)/ 2})`)       
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Team");

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, -10)`)      
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Highest All-Time Winning Percentages");

}); 

d3.csv("../data/football.csv").then(function(data) {
    data = cleanData3(data) 
    let arr = data.map(function(d){return d['win_pct']});
    let arr2 = data.map(function(d){return d['team']}); 

    let max = d3.max(arr)  


    let x = d3.scaleLinear()
        .domain([0, max])
        .range([0, graph_3_width - margin.left - margin.right]);

    
    let y = d3.scaleBand()
        .domain(arr2)
        .range([0, graph_3_height - margin.top - margin.bottom])
        .padding(0.1); 

    
    svg3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg3.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["team"] }))
        .range(d3.quantize(d3.interpolateHcl("#D6BD1D", "#FFE55C"), 10));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['team']) }) 
        .attr("x", x(0))              
        .attr("y", function(d) { return y(d['team'])})
        .attr("width", function(d) {return x(d['win_pct'])})
        .attr("height",  y.bandwidth());        
    
    let counts = countRef3.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(d['win_pct']) + 5})
        .attr("y", function(d) { return y(d['team']) + 25})
        .style("text-anchor", "start")
        .text(function(d) { return d['win_pct']});  

    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, ${graph_3_height - margin.bottom - margin.top + 20})`)
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Winning Percentage (Last 2 World Cups)");

    svg3.append("text")
        .attr("transform", `translate(-100, ${(graph_3_height - margin.bottom - margin.top)/ 2})`)     
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Team"); 

    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, -10)`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top Performing Teams");
});

function cleanData1(data){ 
    let map = new Map(); 
    
    for(row in data){ 
        if(data[row]['date']){ 
            let year = data[row]['date'].slice(0,4); 
            if(parseInt(year)>2010){
                if(map.has(year)){ 
                    map.set(year, map.get(year)+1);
                }
                else{ 
                    map.set(year, 1);
                }
            }
        } 
    }
    let list = [] 

    let arr = Array.from(map.keys())
    for(i in arr){  
        var obj = {}; 
        obj['year'] = parseInt(arr[i]);
        obj['count'] = parseInt(map.get(arr[i]));
        list.push(obj);
    }
    return list
}

let svg3 = d3.select("body")  
    .append("svg") 
    .attr("width", graph_3_width)
    .attr("height", graph_3_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  
    let countRef3 = svg3.append("g");

function cleanData2(data){ 
    let map = new Map(); 

    for(i in data){ 
        if(data[i]['date']){ 
            let h_scr = data[i]['home_score'];
            let a_scr = data[i]['away_score']; 
            let h_tm = data[i]['home_team'];
            let a_tm = data[i]['away_team'];
            if(h_scr > a_scr){ 
                //home 
                if(map.has(h_tm)){ 
                    let val = map.get(h_tm);
                    map.set(h_tm, [val[0] + 1,val[1]]);
                }
                else{ 
                    map.set(h_tm, [1, 0]);
                }
                //away
                if(map.has(a_tm)){ 
                    let val = map.get(a_tm);
                    map.set(a_tm, [val[0], val[1] + 1]);
                }
                else{ 
                    map.set(a_tm, [0, 1]);
                }
            }
            else if(a_scr > h_scr){ 
                //home 
                if(map.has(h_tm)){ 
                    let val = map.get(h_tm);
                    map.set(h_tm, [val[0],val[1] + 1]);
                }
                else{ 
                    map.set(h_tm, [0, 1]);
                }
                //away
                if(map.has(a_tm)){ 
                    let val = map.get(a_tm);
                    map.set(a_tm, [val[0] + 1, val[1]]);
                }
                else{ 
                    map.set(a_tm, [1, 0]);
                }
            }
        }
    }

    let list = [] 

    let arr = Array.from(map.keys())
    for(i in arr){  
        var obj = {}; 
        obj['team'] = arr[i];
        wins = parseInt(map.get(arr[i])[0]);
        losses = parseInt(map.get(arr[i])[1]);
        obj['win_pct'] = Math.round((((wins/(wins+losses))*100)+ Number.EPSILON) * 100) / 100;
        list.push(obj);
    }
    list = cleanData(list, compare, 10);
    return list
}

function cleanData3(data){ 
    let map = new Map();
    for(i in data){ 
        if(data[i]['date']){  
            let year = parseInt(data[i]['date'].slice(0,4));
            if(year >= 2014 && data[i]['tournament'] == "FIFA World Cup" || data[i]['tournament'] == "FIFA World Cup qualification"){
                let h_scr = data[i]['home_score'];
                let a_scr = data[i]['away_score']; 
                let h_tm = data[i]['home_team'];
                let a_tm = data[i]['away_team'];
                if(h_scr > a_scr){ 
                    //home 
                    if(map.has(h_tm)){ 
                        let val = map.get(h_tm);
                        map.set(h_tm, [val[0] + 1,val[1]]);
                    }
                    else{ 
                        map.set(h_tm, [1, 0]);
                    }
                    //away
                    if(map.has(a_tm)){ 
                        let val = map.get(a_tm);
                        map.set(a_tm, [val[0], val[1] + 1]);
                    }
                    else{ 
                        map.set(a_tm, [0, 1]);
                    }
                }
                else if(a_scr > h_scr){ 
                    //home 
                    if(map.has(h_tm)){ 
                        let val = map.get(h_tm);
                        map.set(h_tm, [val[0],val[1] + 1]);
                    }
                    else{ 
                        map.set(h_tm, [0, 1]);
                    }
                    //away
                    if(map.has(a_tm)){ 
                        let val = map.get(a_tm);
                        map.set(a_tm, [val[0] + 1, val[1]]);
                    }
                    else{ 
                        map.set(a_tm, [1, 0]);
                    }
                }
            }
        }
    }
    let list = [] 

    let arr = Array.from(map.keys())
    for(i in arr){  
        var obj = {}; 
        obj['team'] = arr[i];
        wins = parseInt(map.get(arr[i])[0]);
        losses = parseInt(map.get(arr[i])[1]);
        obj['win_pct'] = Math.round((((wins/(wins+losses))*100)+ Number.EPSILON) * 100) / 100;
        list.push(obj);
    }
    list = cleanData(list, compare, 10);
    return list
}

function compare(a,b){
    return b['win_pct'] - a['win_pct'];
}

function cleanData(data, comparator, numExamples) { 
    data = data.sort(comparator)
    data = data.slice(0, numExamples)
    return data;
}

