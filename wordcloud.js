let phrases = [];

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('generateButton').addEventListener('click', generateCloud);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        phrases = parseCSV(text);
    };

    reader.readAsText(file);
}

function parseCSV(text) {
    return text.split(',').map(phrase => phrase.trim());
}

function countPhrases(phrases) {
    const phraseMap = {};
    phrases.forEach(phrase => {
        if (phraseMap[phrase]) {
            phraseMap[phrase]++;
        } else {
            phraseMap[phrase] = 1;
        }
    });
    return Object.entries(phraseMap).map(([phrase, count]) => ({ text: phrase, size: count * 10 }));
}

function generateCloud() {
    if (phrases.length === 0) {
        alert("Please upload a CSV file first.");
        return;
    }

    const phraseCounts = countPhrases(phrases);
    generateWordCloud(phraseCounts);
}

function generateWordCloud(phraseCounts) {
    const width = 800;
    const height = 400;

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(phraseCounts)
        .padding(5)
        .rotate(() => (~~(Math.random() * 2) * 90))
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#wordCloud").selectAll("*").remove(); // Clear previous cloud
        d3.select("#wordCloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text);
    }
}
