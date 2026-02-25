// skillsGraph.js

document.addEventListener("DOMContentLoaded", () => {
    const containerId = "#skills-graph-container";
    const container = d3.select(containerId);

    // Set up SVG dimensions
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth - 40;
    const height = 700;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; display: block; margin: auto;");

    // Define data
    const data = {
        id: "Center",
        color: "#6b72ff", // Center purple/blue
        children: [
            // Purple Nodes
            { id: "Purple Team Exercises", group: "purple", color: "#a87ffb" },
            { id: "Network Telemetry", group: "purple", color: "#a87ffb" },
            { id: "Endpoint Telemetry", group: "purple", color: "#a87ffb" },
            { id: "Detection Gap Analysis", group: "purple", color: "#a87ffb" },
            { id: "Threat Modeling", group: "purple", color: "#a87ffb" },
            { id: "Active Directory Attacks & Defense", group: "purple", color: "#a87ffb" },
            { id: "Detection Engineering", group: "purple", color: "#a87ffb" },
            { id: "Adversary Emulation & Malware Analysis", group: "purple", color: "#a87ffb" },

            // Blue Nodes
            { id: "Threat Hunting", group: "blue", color: "#4facfe" },
            { id: "Digital Forensics and Incident Response", group: "blue", color: "#4facfe" },
            { id: "SOC Operations", group: "blue", color: "#4facfe" },
            { id: "Incident Handling", group: "blue", color: "#4facfe" },
            { id: "Vulnerability/Risk communication", group: "blue", color: "#4facfe" },

            // Red Nodes
            { id: "Reverse Engineering", group: "red", color: "#ff4b4b" },
            { id: "Evasion Techniques", group: "red", color: "#ff4b4b" },
            { id: "Command & Control (C2) Operations", group: "red", color: "#ff4b4b" },
            { id: "Vulnerability Assessment", group: "red", color: "#ff4b4b" },
            { id: "Red Team Assessments", group: "red", color: "#ff4b4b" },
            { id: "Red-Blue Collaboration", group: "red", color: "#ff4b4b" },
            { id: "Penetration Testing", group: "red", color: "#ff4b4b" },
            { id: "Manual & automated exploitation", group: "red", color: "#ff4b4b" }
        ]
    };

    const nodes = [{ id: data.id, x: centerX, y: centerY, isCenter: true, color: data.color }];
    const links = [];

    // Distribute children in a circle
    const numChildren = data.children.length;
    // Let's sort them or group them by color region to match the image visually
    // The image has them ordered: Red (top right) -> Blue (bottom right) -> Purple (left)

    // Custom manual order to match roughly the visual spacing
    // Start angle from top right (approx -PI/4), going clockwise
    const orderedChildren = [
        // Red group
        ...data.children.filter(d => d.group === 'red').reverse(),
        // Blue group
        ...data.children.filter(d => d.group === 'blue').reverse(),
        // Purple group
        ...data.children.filter(d => d.group === 'purple').reverse()
    ];

    const angleStep = (Math.PI * 2) / numChildren;
    // Starting angle offset to put Red at top right
    const startAngle = -Math.PI / 4;

    orderedChildren.forEach((child, i) => {
        const angle = startAngle + i * angleStep;
        // slightly randomize radius to create the jagged shape seen in screenshot
        const r = radius + (Math.random() * 40 - 20);

        const node = {
            id: child.id,
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle),
            isCenter: false,
            color: child.color,
            angle: angle
        };
        nodes.push(node);
        links.push({ source: nodes[0], target: node, color: child.color });
    });

    // Calculate the perimeter path (connecting all outer nodes in order)
    const outerNodes = nodes.filter(n => !n.isCenter);

    // Custom curving for the perimeter line (spline)
    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCatmullRomClosed.alpha(0.5));

    // Add filters for glowing effects
    const defs = svg.append("defs");

    // Add gradient for outer path
    const pathGradient = defs.append("linearGradient")
        .attr("id", "path-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "100%");
    pathGradient.append("stop").attr("offset", "0%").attr("stop-color", "#a87ffb"); // Purple
    pathGradient.append("stop").attr("offset", "50%").attr("stop-color", "#4facfe"); // Blue
    pathGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ff4b4b"); // Red

    // Draw the outer continuous glow line
    const outerPath = svg.append("path")
        .datum(outerNodes)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "url(#path-gradient)")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6)
        .style("filter", "drop-shadow(0px 0px 5px rgba(168,127,251,0.5))");

    // Draw links from center
    const linkSelection = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", d => d.color)
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.3);

    // Draw nodes
    const nodeSelection = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.isCenter ? 15 : 6)
        .attr("fill", d => d.color)
        .style("filter", d => `drop-shadow(0px 0px 8px ${d.color})`)
        .style("cursor", "pointer");

    // Add text labels
    const textSelection = svg.append("g")
        .selectAll("text")
        .data(outerNodes)
        .join("text")
        .attr("x", d => {
            // Adjust text position based on angle
            if (Math.cos(d.angle) > 0) return d.x + 15;
            return d.x - 15;
        })
        .attr("y", d => d.y + 4)
        .text(d => d.id)
        .attr("font-size", "11px")
        .attr("font-family", "Courier New, monospace")
        .attr("fill", "#a8b2d1")
        .attr("text-anchor", d => Math.cos(d.angle) > 0 ? "start" : "end")
        .style("pointer-events", "none");

    // Center node interaction
    const centerNode = nodeSelection.filter(d => d.isCenter);

    // Hover Interactions
    nodeSelection.on("mouseover", function (event, d) {
        if (d.isCenter) {
            linkSelection.attr("opacity", 0.8).attr("stroke-width", 2);
            outerPath.attr("opacity", 1).attr("stroke-width", 3);
        } else {
            d3.select(this).attr("r", 9).style("filter", `drop-shadow(0px 0px 15px ${d.color})`);
            linkSelection.attr("opacity", l => l.target === d ? 1 : 0.1)
                .attr("stroke-width", l => l.target === d ? 3 : 1);
            outerPath.attr("opacity", 0.2);
            textSelection.attr("fill", t => t.id === d.id ? "#ffffff" : "#495670")
                .attr("font-weight", t => t.id === d.id ? "bold" : "normal");
        }
    }).on("mouseout", function (event, d) {
        if (d.isCenter) {
            linkSelection.attr("opacity", 0.3).attr("stroke-width", 1.5);
            outerPath.attr("opacity", 0.6).attr("stroke-width", 2);
        } else {
            d3.select(this).attr("r", 6).style("filter", `drop-shadow(0px 0px 8px ${d.color})`);
            linkSelection.attr("opacity", 0.3).attr("stroke-width", 1.5);
            outerPath.attr("opacity", 0.6);
            textSelection.attr("fill", "#a8b2d1").attr("font-weight", "normal");
        }
    });

    // Simple floating animation
    d3.timer((elapsed) => {
        // animate outer nodes slightly
        nodeSelection.filter(d => !d.isCenter)
            .attr("cy", d => d.y + Math.sin(elapsed / 1000 + d.x) * 5)
            .attr("cx", d => d.x + Math.cos(elapsed / 1000 + d.y) * 5);

        // update links and paths
        linkSelection
            .attr("x2", d => d.target.x + Math.cos(elapsed / 1000 + d.target.y) * 5)
            .attr("y2", d => d.target.y + Math.sin(elapsed / 1000 + d.target.x) * 5);

        // Recompute path for animated nodes
        const animatedNodes = outerNodes.map(d => ({
            x: d.x + Math.cos(elapsed / 1000 + d.y) * 5,
            y: d.y + Math.sin(elapsed / 1000 + d.x) * 5
        }));
        outerPath.datum(animatedNodes).attr("d", lineGenerator);

        textSelection
            .attr("y", d => d.y + 4 + Math.sin(elapsed / 1000 + d.x) * 5)
            .attr("x", d => {
                const ax = d.x + Math.cos(elapsed / 1000 + d.y) * 5;
                return Math.cos(d.angle) > 0 ? ax + 15 : ax - 15;
            });
    });
});
