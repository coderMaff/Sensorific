const version = "0.2.0";
const copyright = "(c)2025 Matt Bushell";
const DEBUG = true;
const EXAMPLE_URL = "https://kardiak.co.uk/api/download/count";
//const EXAMPLE_URL = "https://environment.data.gov.uk/flood-monitoring/id/measures/E71239-level-tidal_level-Mean-15_min-mAOD/readings?_sorted&_limit=2";
const TIP_URL = "https://ko-fi.com/I3I171N0";

const SKIP_LIST = "@context,meta";

// Test URLS
// https://environment.data.gov.uk/flood-monitoring/id/measures/E71239-level-tidal_level-Mean-15_min-mAOD/readings?_sorted&_limit=2
// https://kardiak.co.uk/api/download/count

document.addEventListener('DOMContentLoaded', function () {

  const targetElement = document.getElementsByTagName('body')[0];

  if (targetElement) {
    main();
  } else {
    console.warn("Target DOM element not found.");
  }
});


function main() {
  let bodyTag = document.getElementsByTagName('body')[0];

  bodyTag.style.fontFamily = 'Arial, sans-serif';
  bodyTag.style.margin = '5px';
  bodyTag.style.backgroundColor = '#f4f4f4';
  bodyTag.style.color = '#333';
  bodyTag.style.textAlign = 'center';
  bodyTag.style.lineHeight = '1.6';
  bodyTag.style.minHeight = '100vh';
  bodyTag.style.display = 'flex';
  bodyTag.style.flexDirection = 'column';
  bodyTag.style.alignItems = 'center';
  bodyTag.style.padding = '5px';
  bodyTag.style.boxSizing = 'border-box';
  bodyTag.style.gap = '5px';
  bodyTag.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  bodyTag.style.borderRadius = '8px';
  bodyTag.style.maxWidth = '800px';
  bodyTag.style.marginLeft = 'auto';
  bodyTag.style.marginRight = 'auto';

  let h2Tag = Object.assign(document.createElement('h2'), {
    textContent: "Sensorific - HomeAssistant RESTful Sensor Creator v" + version
  });

  let h3Tag = Object.assign(document.createElement('h3'), {
    textContent: copyright
  });

  let h4Tag = Object.assign(document.createElement('h4'), {
    innerHTML: `If you find this useful, <a href="${TIP_URL}">leave me a tip</a>. Please note, the sensors are unlikely to be perfect and will need a little fine tuning but it should give you a good starting point`
  });

  let inputURLTag = Object.assign(
    document.createElement('input'), {
    id: 'apiURLInput',
    type: 'text',
    placeholder: 'Enter your RESTFul API URL here',
    style: 'width:95%; height: 30px; font-size: 16px;',
    value: (DEBUG ? EXAMPLE_URL : "")
  });

  let inputNameTag = Object.assign(
    document.createElement('input'), {
    id: 'sensorNameInput',
    type: 'text',
    placeholder: 'Enter your Sensor Name here',
    style: 'width:95%; height: 30px; font-size: 16px;'
  });

  let inputIntervalTag = Object.assign(
    document.createElement('input'), {
    id: 'sensorIntervalInput',
    type: 'text',
    placeholder: 'Enter your Sensor Interval here, default 60 seconds',
    style: 'width:95%; height: 30px; font-size: 16px;'
  });

  let inputUnitTag = Object.assign(
    document.createElement('input'), {
    id: 'sensorDownloadInput',
    type: 'text',
    placeholder: 'Enter your Sensor Download unit of measurement here, default is lemmings',
    style: 'width:95%; height: 30px; font-size: 16px;'
  });

  let outputTextAreaTag = Object.assign(
    document.createElement('textarea'), {
    id: 'outputTextArea',
    style: 'width:95%; height: 300px; font-size: 14px;',
    readOnly: true
  });

  let dataTextAreaTag = Object.assign(
    document.createElement('textarea'), {
    id: 'dataTextArea',
    style: 'width:95%; height: 200px; font-size: 14px;',
    readOnly: false
  });

  let selectedMethod = 'GET'; // default

  const getButtonTag = Object.assign(document.createElement('button'), {
    id: 'getButton',
    textContent: 'GET',
    style: 'background-color: green; color: white; font-weight: bold; margin:6px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;'
  });

  const postButtonTag = Object.assign(document.createElement('button'), {
    id: 'postButton',
    textContent: 'POST',
    style: 'background-color: blue; color: white; font-weight: bold; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;'
  });

  // 🔁 Toggle logic
  function updateMethodSelection(method) {
    selectedMethod = method;

    if (method === 'GET') {
      getButtonTag.style.opacity = '1';
      getButtonTag.style.boxShadow = '0 0 5px #0f0';
      postButtonTag.style.opacity = '0.6';
      postButtonTag.style.boxShadow = 'none';
    } else {
      postButtonTag.style.opacity = '1';
      postButtonTag.style.boxShadow = '0 0 5px #00f';
      getButtonTag.style.opacity = '0.6';
      getButtonTag.style.boxShadow = 'none';
    }
  }

  // 🖱️ Event listeners
  getButtonTag.addEventListener('click', () => updateMethodSelection('GET'));
  postButtonTag.addEventListener('click', () => updateMethodSelection('POST'));

  // 🧩 Container
  const methodButtonContainer = Object.assign(document.createElement('div'), {
    id: 'methodButtonContainer',
    style: 'font-size: 14px;'
  });

  methodButtonContainer.append(getButtonTag, postButtonTag);

  let selectedComplexity = 'SIMPLE'; // default

  const simpleButtonTag = Object.assign(document.createElement('button'), {
    id: 'simpleButton',
    textContent: 'SIMPLE',
    style: 'background-color: rgba(205, 147, 0, 1); color: white; font-weight: bold; margin:6px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;'
  });

  const complexButtonTag = Object.assign(document.createElement('button'), {
    id: 'complexButton',
    textContent: 'COMPLEX',
    style: 'background-color: rgba(110, 21, 253, 1); color: white; font-weight: bold; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;'
  });

  // 🔁 Toggle logic
  function updateComplexitySelection(complexity) {
    selectedComplexity = complexity;

    if (complexity === 'SIMPLE') {
      simpleButtonTag.style.opacity = '1';
      simpleButtonTag.style.boxShadow = '0 0 5px rgba(205, 147, 0, 1)';
      complexButtonTag.style.opacity = '0.6';
      complexButtonTag.style.boxShadow = 'none';
    } else {
      complexButtonTag.style.opacity = '1';
      complexButtonTag.style.boxShadow = '0 0 5px rgba(110, 21, 253, 1)';
      simpleButtonTag.style.opacity = '0.6';
      simpleButtonTag.style.boxShadow = 'none';
    }
  }

  // 🖱️ Event listeners
  simpleButtonTag.addEventListener('click', () => updateComplexitySelection('SIMPLE'));
  complexButtonTag.addEventListener('click', () => updateComplexitySelection('COMPLEX'));

  // 🧩 Container
  const complexityButtonContainer = Object.assign(document.createElement('div'), {
    id: 'complexityButtonContainer',
    style: 'font-size: 14px;'
  });

  complexityButtonContainer.append(simpleButtonTag, complexButtonTag);

  const submitButtonTag = Object.assign(document.createElement('button'), {
    id: 'sbmitButton',
    textContent: 'Submit!',
    style: 'background-color: red; color: white; font-weight: bold; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;'
  });

  submitButtonTag.addEventListener('click', () => {
    outputTextAreaTag.value = process(dataTextAreaTag, selectedMethod, selectedComplexity, inputURLTag.value, inputNameTag.value, inputIntervalTag.value, inputUnitTag.value);
  });

  function note(pId, pData) {
    return Object.assign(
      document.createElement('div'), {
      id: pId,
      style: 'width:95%; font-size: 12px;',
      readOnly: false,
      textContent: pData
    });
  }

  bodyTag.appendChild(h2Tag);
  bodyTag.appendChild(h3Tag);
  bodyTag.appendChild(h4Tag);
  bodyTag.appendChild(inputURLTag);
  bodyTag.appendChild(note("egUrl", "e.g. " + EXAMPLE_URL));
  bodyTag.appendChild(methodButtonContainer);
  bodyTag.appendChild(note("egMethod", "click 'GET'"));
  bodyTag.appendChild(complexityButtonContainer);
  bodyTag.appendChild(note("egComplexity", "click 'SIMPLE'"));
  bodyTag.appendChild(inputNameTag);
  bodyTag.appendChild(note("egName", "e.g. Kardiak Download Count"));
  bodyTag.appendChild(inputIntervalTag);
  bodyTag.appendChild(note("egInterval", "300 (5minutes)"));
  bodyTag.appendChild(inputUnitTag);
  bodyTag.appendChild(note("egUnit", "e.g. downloads"));
  bodyTag.appendChild(submitButtonTag);
  bodyTag.appendChild(outputTextAreaTag);
  bodyTag.appendChild(note("egText", "copy the resultant data back to your configuration.yaml file being careful to check for preexisting _sensors etc..."));
  bodyTag.appendChild(dataTextAreaTag);
  bodyTag.appendChild(note("egData", "This is the result of a call to your RESTful service"));

}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function toSnakeCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]+/g, '') // remove non-alphanumerics
    .trim()
    .replace(/\s+/g, '_'); // replace spaces with underscores
}

function isNumericOrTimeValue(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return true;
  }

  if (typeof value === 'string' && value.trim() !== "") {
    const trimmedValue = value.trim();

    if (/^[-+]?(\d+|\d*\.\d+)$/.test(trimmedValue)) {
      return isFinite(trimmedValue);
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(trimmedValue)) {
      return true;
    }

    if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(trimmedValue)) {
      return true;
    }
  }

  return false;
}

function processJsonRecursive(
  currentNode,
  currentPath,
  listArray,
  inputName,
  inputUnit,
  addThis
) {

  const sensorBaseName = inputName.length > 0 ? inputName : "Your Sensor Name";
  const unitText = inputUnit.length > 0 ? inputUnit : "lemmings";


  for (const [key, value] of Object.entries(currentNode)) {

    console.log("scanning JSON", key);

    if (listArray.includes(key)) {
      console.log("Skipping due to list array");
      continue;
    }

    // Build the full path for the value_template using safe bracket notation
    const newPath = `${currentPath}['${key}']`;

    if (typeof value === 'object' && value !== null) {

      console.log("Found an object");

      if (Array.isArray(value)) {
        // Handle Arrays by iterating over items
        console.log("Its an array");
        value.forEach((item, index) => {
          console.log("scanning item", item);
          const arrayPath = `${currentPath}['${key}'][${index}]`;

          // Check if array item is a complex object/array itself
          if (typeof item === 'object' && item !== null) {
            console.log("Found an object 2");
            // Recurse into the array item, updating the path with the index
            addThis = processJsonRecursive(
              item,
              arrayPath,
              listArray,
              inputName,
              inputUnit,
              addThis
            );
          } else {

            if (!isNumericOrTimeValue(item)) {
              console.log(`Skipping non-numeric/time value in array at index: ${index}`);
              return; 
            }

            console.log("Populating 1 (Numeric/Time Array Value)");
            const sensorName = `${sensorBaseName} ${key} ${index}`;
            const snakeIn = `${sensorBaseName} ${arrayPath}`;

            addThis += `     - name: "${sensorName}"\n`;
            addThis += `       value_template: "{{ value_json${arrayPath} | default(none) }}"\n`;
            addThis += `       unit_of_measurement: "${unitText}"\n`;
            addThis += `       unique_id: "${toSnakeCase(snakeIn)}"\n`;
          }
        });
      } else {
        // It's a non-array Object, so recurse
        addThis = processJsonRecursive(
          value,
          newPath,
          listArray,
          inputName,
          inputUnit,
          addThis
        );
      }

    } else {
    
      if (!isNumericOrTimeValue(value)) {
        console.log(`Skipping non-numeric/time value for key: ${key}`);
        continue; // Skips to the next key in the for loop
      }

      console.log("Populating 2 (Numeric/Time Value)");
      const sensorName = `${sensorBaseName} ${key}`;
      const snakeIn = `${sensorBaseName} ${newPath}`;

      addThis += `     - name: "${sensorName}"\n`;
      addThis += `       value_template: "{{ value_json${newPath} | default(none) }}"\n`;
      addThis += `       unit_of_measurement: "${unitText}"\n`;
      addThis += `       unique_id: "${toSnakeCase(snakeIn)}"\n`;
    }
  }

  return addThis;
}

function process(dataTextArea, method, complexity, apiURL, inputName, inputInterval, inputUnit) {

  if (!isValidURL(apiURL)) {
    return "Error: Enter a valid URL";
  }

  const options = {
    method: method
  };

  let json = "";
  const listArray = SKIP_LIST.split(",");

  fetch(apiURL, options)
    .then(response => response.text()) // get raw text first
    .then(raw => {
      try {
        json = JSON.parse(raw);
      } catch (jsonError) {
        console.warn("⚠️ JSON parse failed, trying XML…", jsonError);

        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(raw, "application/xml");

          // Optional: pretty-print XML
          const serializer = new XMLSerializer();
          const xmlString = serializer.serializeToString(xmlDoc);

          console.log("✅ XML Response:", xmlString);
          dataTextArea.value = xmlString;
          debugger;
        } catch (xmlError) {
          console.error("❌ XML parse also failed:", xmlError);
          dataTextArea.value = "Unrecognized response format.";
        }

        return;

      }

      console.log("✅ JSON Response:", JSON.stringify(json, null, 2));
      dataTextArea.value = JSON.stringify(json, null, 2);
      if (complexity == "SIMPLE") {
        const [key, value] = Object.entries(json)[0];
        document.getElementById("outputTextArea").value = document.getElementById("outputTextArea").value.replace("YOUR_JSON_KEY", key);
      } else {

        let addThis = "    sensor:\n";

        // Start the recursion
        addThis = processJsonRecursive(
          json,
          "", // Start with an empty path
          listArray,
          inputName,
          inputUnit,
          addThis // Pass the initial string
        );

        document.getElementById("outputTextArea").value += addThis;
      }

    })
    .catch(fetchError => {
      console.error("❌ Fetch error:", fetchError);
      dataTextArea.value = "Fetch failed: " + fetchError.message;
    });

  let output = "";
  if (complexity == "SIMPLE") {
    output += "sensor:\n";
    output += "  - platform: rest\n";
    output += `    name: ${(inputName.length > 0 ? inputName : "Your Sensor Name")}\n`;
    output += "    unique_id: " + toSnakeCase((inputName.length > 0 ? inputName : "your_sensor_name")) + "\n";
    output += "    resource: " + apiURL + "\n";
    output += "    value_template: '{{ value_json.YOUR_JSON_KEY }}'\n";
    output += `    unit_of_measurement: ${(inputUnit.length > 0 ? inputUnit : "lemmings")}\n`;
    if (method === 'POST') {
      output += "    method: POST\n";
      output += "    payload: '{ \"Key1\" : \"Value1\" }'\n";
    }
  } else {
    output += "rest:\n";
    output += `  - resource: ${apiURL} \n`;
  }

  output += `    scan_interval: ${(inputInterval.length > 0 ? inputInterval : "60")}\n`;

  return output;
}