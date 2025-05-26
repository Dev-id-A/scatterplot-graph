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
    const createSVG = (data) =>{
        const svg = d3.select("body")
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("viewBox", "0 0 100 100")
                        .attr("preserveAspectRatio", "xMidYMid meet");

//Title
        svg.append("text")
            .text("Most fastest riders and doping")
            .attr("y", 5)
            .attr("x", 33)
            .attr("font-size", 3);
            
    }

    fetchData()
        .then(d=>{
            createSVG(d)
            console.log(d);
            console.log(d[10].Time);
            console.log(d[0].Doping);
        })