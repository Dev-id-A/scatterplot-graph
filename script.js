//Variables
    const width = 800;
    const height = 500;
    const padding = 150;

//Fetching data  
    async function fetchData() {
        try{
            const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
            const data = await response.json();
                return data;
    
        }
        catch(e){
            window.alert("There was an error trying to obtain data.")
        }
    }

//SVG creation
const createSVG = (data) => {

    const svg = d3.select("body")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("background-color", "wheat");

//Title
        svg.append("text")
            .attr("id", "title")
            .text("Most fastest riders and doping")
            .attr("y", 50)
            .attr("x", 300)
            .attr("font-size", 20);

//Legend
    //Background
        svg.append("rect")
            .attr("id", "legend-background")
            .attr("height", 40)
            .attr("width", 130)
            .attr("fill", "aliceblue")
            .attr("x", width - padding * 1.6)
            .attr("y", padding - 15);

    // Doping allegation
        svg.append("text")
            .attr("id", "legend")
            .text("Doping allegations")
            .attr("x", width - padding*1.5)
            .attr("y", padding)
            .attr("font-size", 10);
        
        svg.append("rect")
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "#CD5C5C")
            .attr("x", width - padding + 17)
            .attr("y", padding - 8);
        
    //No doping allegation
        svg.append("text")
            .attr("id", "legend")
            .text("No doping allegations")
            .attr("x", width - padding*1.5)
            .attr("y", padding + 15)
            .attr("font-size", 10);

        svg.append("rect")
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "#87CEFA")
            .attr("x", width - padding + 17)
            .attr("y", padding + 6);


//xScale
const minYear = d3.min(data,d => d.Year);
const maxYear = d3.max(data,d => d.Year);

        const xScale = d3.scaleLinear()
                            .domain([minYear -1, maxYear +1])
                            .range([padding, width - padding]);

        const xAxis = d3.axisBottom(xScale)
                            .tickFormat(d3.format("d"));
        
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis)

//yScale
const timeParse = d3.timeParse("%M:%S")

        const yScale = d3.scaleTime()
                            .domain(d3.extent(data, d => timeParse(d.Time)))
                            .range([padding/2, height - padding]);

        const yAxis = d3.axisLeft(yScale)
                        .tickFormat(d3.timeFormat("%M:%S"));

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis)

//Circles
        const dots = svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("class", "dot")
                        .attr("cy", d => yScale(timeParse(d.Time)))
                        .attr("cx", d => xScale(d.Year))
                        .attr("r", 4)

//Circles styling
                        .attr("fill", d => d.Doping ? "#CD5C5C":"#87CEFA" )
                        .attr("stroke", d => d.Doping ? "#8B3A3A":"#607B8B")
                        .attr("stroke-width", 1)
                        .style("opacity", "0.8");

//Tooltip creation
            const tooltip = d3.select("body")
                                .append("div")
                                .attr("id", "tooltip")

//Tooltip styling
                                .style("position", "absolute")
                                .style("opacity", 0)
                                .style("border", "3px solid black")
                                .style("padding", "1%")
                                .style("font-size", "14px")
                                .style("border-radius", "10px");

//Tooltip adittion on dots
                        dots.attr("data-xvalue", d => d.Year)
                        .attr("data-yvalue", d => {
                            const [min, seg] = d.Time.split(":").map(Number);
                            return new Date(Date.UTC(1970, 0, 1, 0, min, seg))
                        })
                        .on("mouseover", (e, d) => {
                            tooltip.style("opacity", 1)
                                    .style("display", "block")
                                    .attr("data-year", d.Year)
                                    .style("background-color", d.Doping ? "#E99696":"#B0E0FF")                                   
                                    .html(`Name: ${d.Name}, Nationality: ${d.Nationality}<br>
                                            Year: ${d.Year}, Time: ${d.Time}<br>
                                            Doping: ${d.Doping ? d.Doping:"The rider has no doping allegation"}`);
                        })
                        .on("mousemove", e => {
                            tooltip.style("left", (e.pageX + 20) + "px")
                                    .style("top", (e.pageY - 30) + "px");
                        })
                        .on("mouseout", () =>{
                            tooltip.style("opacity", 0)
                                    .style("display", "none");
                        })

    }

    fetchData()
        .then(d=>{
            createSVG(d)
            console.log(d);
            console.log(d[10].Time);
            console.log(d[0].Doping);
        })