// Conversion factors
const unitConversions = {
    velocity: {
        "m/s": 1,
        "cm/s": 100,
        "km/h": 3.6,
        "ft/s": 3.28084,
        "mph": 2.23694,
        "knots": 1.94384,
    },
    acceleration: {
        "m/s²": 1,
        "cm/s²": 100,
        "km/s²": 0.001,
        "ft/s²": 3.28084,
        "mi/s²": 0.000621371,
        "g": 0.101972,
    },
    time: {
        seconds: 1,
        minutes: 60,
        hours: 3600,
    },
};

// Calculation functions
const calculations = {
    finalVelocity: (v0, a, t) => v0 + (a * t),
    initialVelocity: (vt, a, t) => vt - (a * t),
    acceleration: (vt, v0, t) => (t !== 0 ? (vt - v0) / t : 0),
    time: (vt, v0, a) => (a !== 0 ? (vt - v0) / a : 0),
};

// Convert input to base units
function convertToBase(value, unit, type) {
    if (isNaN(value) || value === null || value === "") return 0;
    return value / (unitConversions[type][unit] || 1);
}

// Convert output from base units
function convertFromBase(value, unit, type) {
    return value * (unitConversions[type][unit] || 1);
}

// Get input value and convert to base units
function getInputValue(inputId, unitId, type) {
    const inputElement = document.getElementById(inputId);
    const unitElement = document.getElementById(unitId);

    const value = parseFloat(inputElement?.value || 0);
    const unit = unitElement?.value || Object.keys(unitConversions[type])[0];

    return convertToBase(value, unit, type);
}

function updateOutput(outputId, result, unit) {
    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        // Find or create a span for the numerical result
        let resultSpan = outputElement.querySelector(".result-value");
        if (!resultSpan) {
            resultSpan = document.createElement("span");
            resultSpan.className = "result-value";
            outputElement.insertBefore(resultSpan, outputElement.firstChild); // Insert at the start
        }

        // Update only the result value
        resultSpan.textContent = `${result.toFixed(4)} `;

        // Ensure the dropdown remains intact
        const unitDropdown = outputElement.querySelector("select");
        if (unitDropdown) {
            unitDropdown.value = unit; // Set dropdown to the current unit
        }
    }
}


// Perform calculation for a specific tab
function calculate(tabId) {
    let v0 = 0, vt = 0, a = 0, t = 0, result;

    // Map tab IDs to input fields and output units
    const inputMap = {
        finalVelocity: {
            v0: ["initialVelocityFV", "initialVelocityUnitFV", "velocity"],
            a: ["accelerationFV", "accelerationUnitFV", "acceleration"],
            t: ["timeFV", "timeUnitFV", "time"],
            outputUnitId: "finalVelocityOutput",
            type: "velocity",
        },
        initialVelocity: {
            vt: ["finalVelocityIV", "finalVelocityUnitIV", "velocity"],
            a: ["accelerationIV", "accelerationUnitIV", "acceleration"],
            t: ["timeIV", "timeUnitIV", "time"],
            outputUnitId: "initialVelocityOutput",
            type: "velocity",
        },
        acceleration: {
            vt: ["finalVelocityAcc", "finalVelocityUnitAcc", "velocity"],
            v0: ["initialVelocityAcc", "initialVelocityUnitAcc", "velocity"],
            t: ["timeAcc", "timeUnitAcc", "time"],
            outputUnitId: "accelerationOutput",
            type: "acceleration",
        },
        time: {
            vt: ["finalVelocityTime", "finalVelocityUnitTime", "velocity"],
            v0: ["initialVelocityTime", "initialVelocityUnitTime", "velocity"],
            a: ["accelerationTime", "accelerationUnitTime", "acceleration"],
            outputUnitId: "timeOutput",
            type: "time",
        },
    };

    const inputs = inputMap[tabId];
    if (inputs) {
        v0 = inputs.v0 ? getInputValue(...inputs.v0) : 0;
        vt = inputs.vt ? getInputValue(...inputs.vt) : 0;
        a = inputs.a ? getInputValue(...inputs.a) : 0;
        t = inputs.t ? getInputValue(...inputs.t) : 0;
    }

    // Perform calculation
    if (tabId === "finalVelocity") {
        result = calculations.finalVelocity(v0, a, t);
    } else if (tabId === "initialVelocity") {
        result = calculations.initialVelocity(vt, a, t);
    } else if (tabId === "acceleration") {
        result = calculations.acceleration(vt, v0, t);
    } else if (tabId === "time") {
        result = calculations.time(vt, v0, a);
    }

    // Convert result to the selected unit
    const outputUnitId = inputs.outputUnitId;
    const outputUnit = document.getElementById(outputUnitId)?.value || Object.keys(unitConversions[inputs.type])[0];
    result = convertFromBase(result, outputUnit, inputs.type);

    // Update output
    updateOutput(outputUnitId, result, outputUnit);
}

// Tab switching function
function openTab(evt, tabName) {
    // Deactivate all tabs and buttons
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));

    // Activate the selected tab and button
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Event listeners for calculate buttons
document.querySelectorAll(".tab-content button").forEach(button => {
    button.addEventListener("click", () => {
        const tabId = button.closest(".tab-content").id;
        calculate(tabId);
    });
});

// Event listeners for unit dropdown changes
document.querySelectorAll(".unit-select").forEach(select => {
    select.addEventListener("change", () => {
        const tabId = select.closest(".tab-content").id;
        calculate(tabId);
    });
});
