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
    }

    fetchData()
        .then(d=>{
            createSVG(d)
            console.log(d);
            console.log(d[10].Time);
            console.log(d[0].Doping);
        })