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

// Get and convert input value
function getInputValue(inputId, unitId, type) {
    const inputElement = document.getElementById(inputId);
    const unitElement = document.getElementById(unitId);

    const value = parseFloat(inputElement?.value || 0);
    const unit = unitElement?.value || Object.keys(unitConversions[type])[0];

    return convertToBase(value, unit, type);
}

// Update the displayed output
function updateOutput(outputId, result, unit) {
    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        outputElement.textContent = `${result.toFixed(4)} ${unit}`;
    }
}

// Perform calculation for a specific tab
function calculate(tabId) {
    let v0 = 0, vt = 0, a = 0, t = 0, result;

    // Map tab IDs to input fields and output
    const inputMap = {
        finalVelocity: {
            v0: ["initialVelocityFV", "initialVelocityUnitFV", "velocity"],
            a: ["accelerationFV", "accelerationUnitFV", "acceleration"],
            t: ["timeFV", "timeUnitFV", "time"],
            outputId: "finalVelocityOutput",
            type: "velocity",
        },
        initialVelocity: {
            vt: ["finalVelocityIV", "finalVelocityUnitIV", "velocity"],
            a: ["accelerationIV", "accelerationUnitIV", "acceleration"],
            t: ["timeIV", "timeUnitIV", "time"],
            outputId: "initialVelocityOutput",
            type: "velocity",
        },
        acceleration: {
            vt: ["finalVelocityAcc", "finalVelocityUnitAcc", "velocity"],
            v0: ["initialVelocityAcc", "initialVelocityUnitAcc", "velocity"],
            t: ["timeAcc", "timeUnitAcc", "time"],
            outputId: "accelerationOutput",
            type: "acceleration",
        },
        time: {
            vt: ["finalVelocityTime", "finalVelocityUnitTime", "velocity"],
            v0: ["initialVelocityTime", "initialVelocityUnitTime", "velocity"],
            a: ["accelerationTime", "accelerationUnitTime", "acceleration"],
            outputId: "timeOutput",
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
    switch (tabId) {
        case "finalVelocity":
            result = calculations.finalVelocity(v0, a, t);
            break;
        case "initialVelocity":
            result = calculations.initialVelocity(vt, a, t);
            break;
        case "acceleration":
            result = calculations.acceleration(vt, v0, t);
            break;
        case "time":
            result = calculations.time(vt, v0, a);
            break;
        default:
            return;
    }

    // Update output
    const outputUnit = document.getElementById(inputs.outputId).dataset.unit || Object.keys(unitConversions[inputs.type])[0];
    result = convertFromBase(result, outputUnit, inputs.type);
    updateOutput(inputs.outputId, result, outputUnit);
}

// Tab switching functionality
function openTab(evt, tabName) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    // Remove active class from all buttons
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));

    // Show the selected tab content and mark the button as active
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Populate dropdowns for units
function populateDropdowns() {
    const dropdowns = {
        finalVelocityUnitFV: "velocity",
        accelerationUnitFV: "acceleration",
        timeUnitFV: "time",
        finalVelocityUnitIV: "velocity",
        accelerationUnitIV: "acceleration",
        timeUnitIV: "time",
        finalVelocityUnitAcc: "velocity",
        initialVelocityUnitAcc: "velocity",
        timeUnitAcc: "time",
        finalVelocityUnitTime: "velocity",
        initialVelocityUnitTime: "velocity",
        accelerationUnitTime: "acceleration",
    };

    Object.entries(dropdowns).forEach(([dropdownId, type]) => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = Object.keys(unitConversions[type])
            .map(unit => `<option value="${unit}">${unit}</option>`)
            .join("");
    });
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();

    // Add event listeners for calculate buttons
    document.querySelectorAll(".tab-content button").forEach(button => {
        button.addEventListener("click", () => {
            const tabId = button.closest(".tab-content").id;
            calculate(tabId);
        });
    });

    // Update calculation on dropdown change
    document.querySelectorAll(".unit-select").forEach(select => {
        select.addEventListener("change", () => {
            const tabId = select.closest(".tab-content").id;
            calculate(tabId);
        });
    });
});
