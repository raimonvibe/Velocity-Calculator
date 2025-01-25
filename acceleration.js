// Function to open the tab
function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Calculation functions
const calculations = {
    finalVelocity: (v0, a, t) => v0 + (a * t),
    initialVelocity: (vt, a, t) => vt - (a * t),
    acceleration: (vt, v0, t) => (t !== 0 ? (vt - v0) / t : 0),
    time: (vt, v0, a) => (a !== 0 ? (vt - v0) / a : 0),
};

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

// Convert input to base units
function convertToBase(value, unit, type) {
    if (isNaN(value) || value === null || value === "") return 0;
    return value / (unitConversions[type][unit] || 1);
}

// Convert output from base units
function convertFromBase(value, unit, type) {
    return value * (unitConversions[type][unit] || 1);
}

function getInputValue(inputId, unitId, type) {
    const inputElement = document.getElementById(inputId);
    const unitElement = document.getElementById(unitId);

    const value = parseFloat(inputElement?.value || 0);
    const unit = unitElement?.value || Object.keys(unitConversions[type])[0];

    return convertToBase(value, unit, type);
}

// Update the output on the tab
function updateOutput(outputId, result, unit) {
    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        outputElement.textContent = `${result.toFixed(4)} ${unit}`;
    }
}

// Perform calculation for a specific tab
function calculate(tabId) {
    let v0 = 0, vt = 0, a = 0, t = 0, result;

    // Map tab IDs to input fields
    const inputMap = {
        finalVelocity: {
            v0: ["initialVelocityInput", "initialVelocityUnit", "velocity"],
            a: ["accelerationInput", "accelerationUnit", "acceleration"],
            t: ["timeInput", "timeUnit", "time"],
        },
        initialVelocity: {
            vt: ["finalVelocityInput", "finalVelocityUnit", "velocity"],
            a: ["accelerationInput", "accelerationUnit", "acceleration"],
            t: ["timeInput", "timeUnit", "time"],
        },
        acceleration: {
            vt: ["finalVelocityInput", "finalVelocityUnit", "velocity"],
            v0: ["initialVelocityInput", "initialVelocityUnit", "velocity"],
            t: ["timeInput", "timeUnit", "time"],
        },
        time: {
            vt: ["finalVelocityInput", "finalVelocityUnit", "velocity"],
            v0: ["initialVelocityInput", "initialVelocityUnit", "velocity"],
            a: ["accelerationInput", "accelerationUnit", "acceleration"],
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
    const outputUnitId = "accelerationUnit";
    const outputUnit = document.getElementById(outputUnitId)?.value || "m/s²";
    result = convertFromBase(result, outputUnit, "acceleration");

    // Update output
    const outputId = `${tabId}Output`;
    updateOutput(outputId, result, outputUnit);
}

// Add event listeners for calculate buttons
document.querySelectorAll(".tab-content button").forEach(button => {
    button.addEventListener("click", () => {
        const tabId = button.closest(".tab-content").id;
        calculate(tabId);
    });
});

// Add event listeners for unit dropdown changes
document.querySelectorAll(".unit-select").forEach(select => {
    select.addEventListener("change", () => {
        const tabId = select.closest(".tab-content").id;
        calculate(tabId);
    });
});
