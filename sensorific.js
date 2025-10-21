document.addEventListener('DOMContentLoaded', function () {
  const targetElement = document.getElementsByTagName('body')[0];

  if (targetElement) {
    main();
  } else {
    console.warn("Target DOM element not found.");
  }
});

let version = "0.1.0";
let copyright = "(c)2025 Matt Bushell" ;

function main() {
  let bodyTag = document.getElementsByTagName('body')[0];

  bodyTag.style.fontFamily = 'Arial, sans-serif';
  bodyTag.style.margin = '20px';
  bodyTag.style.backgroundColor = '#f4f4f4';
  bodyTag.style.color = '#333';
  bodyTag.style.textAlign = 'center';
  bodyTag.style.lineHeight = '1.6';
  bodyTag.style.minHeight = '100vh';
  bodyTag.style.display = 'flex';
  bodyTag.style.flexDirection = 'column';
  bodyTag.style.alignItems = 'center';
  bodyTag.style.padding = '20px';
  bodyTag.style.boxSizing = 'border-box';
  bodyTag.style.gap = '12px';
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

  let inputURLTag = Object.assign(
    document.createElement('input'), {
    id: 'apiURLInput',
    type: 'text',
    placeholder: 'Enter your RESTFul API URL here',
    style: 'width:95%; height: 30px; font-size: 16px;'    
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

     if(inputURLTag.value.trim().length > 0 || inputNameTag.value.trim().length > 0) {
      outputTextAreaTag.value = process(inputURLTag.value, inputNameTag.value, dataTextAreaTag, selectedMethod, inputIntervalTag.value, inputUnitTag.value);
     }  
  }

  // 🖱️ Event listeners
  getButtonTag.addEventListener('click', () => updateMethodSelection('GET'));
  postButtonTag.addEventListener('click', () => updateMethodSelection('POST'));

  // 🧩 Container
  const methodButtonContainer = Object.assign(document.createElement('div'), {
    id: 'methodButtonContainer',
    style: 'margin-bottom: 12px; font-size: 14px;'
  });

  methodButtonContainer.append(getButtonTag, postButtonTag);

  bodyTag.appendChild(h2Tag);
  bodyTag.appendChild(h3Tag);
  bodyTag.appendChild(inputURLTag);
  bodyTag.appendChild(methodButtonContainer);
  bodyTag.appendChild(inputNameTag);
  bodyTag.appendChild(inputIntervalTag);
  bodyTag.appendChild(inputUnitTag);
  bodyTag.appendChild(outputTextAreaTag);
  bodyTag.appendChild(dataTextAreaTag);

  let debounceTimer;

  document.addEventListener('input', function (event) {    
    if(event.target === inputURLTag || event.target === inputNameTag || event.target === inputIntervalTag || event.target === inputUnitTag) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if(inputURLTag.value.trim().length > 0 || inputNameTag.value.trim().length > 0) {
          outputTextAreaTag.value = process(inputURLTag.value, inputNameTag.value, dataTextAreaTag, selectedMethod, inputIntervalTag.value, inputUnitTag.value);
        }
      }, 500);
    }
  });

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

function process(apiURL, inputName, dataTextArea, method, inputInterval, inputUnit) {

  if(!isValidURL(apiURL)) {
    return "Error: Enter a valid URL";
  }

  const options = {
    method: method
  };

  fetch(apiURL, options)
  .then(response => response.text()) // get raw text first
  .then(raw => {
    try {
      const json = JSON.parse(raw);
      console.log("✅ JSON Response:", JSON.stringify(json, null, 2));
      dataTextArea.value = JSON.stringify(json, null, 2);
      const [key, value] = Object.entries(json)[0];
      document.getElementById("outputTextArea").value = document.getElementById("outputTextArea").value.replace("YOUR_JSON_KEY",key);
    } catch (jsonError) {
      console.warn("⚠️ JSON parse failed, trying XML…",jsonError);

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
    }
  })
  .catch(fetchError => {
    console.error("❌ Fetch error:", fetchError);
    dataTextArea.value = "Fetch failed: " + fetchError.message;
  });

  let output = "";
  output += "sensor:\n";
  output += "  - platform: rest\n";
  output += "    name: " + (inputName.length > 0 ? inputName : "Your Sensor Name") + "\n";
  output += "    unique_id: " + toSnakeCase((inputName.length > 0 ? inputName : "your_sensor_name")) + "\n";
  output += "    resource: " + apiURL + "\n";  
  output += "    value_template: '{{ value_json.YOUR_JSON_KEY }}'\n";
  output += "    unit_of_measurement: " + (inputUnit.length > 0 ? inputUnit : "lemmings") + "\n";
  output += "    scan_interval: " + (inputInterval.length > 0 ? inputInterval : "60") + "\n";
  if(method === 'POST') {
    output += "    method: POST\n";
    output += "    payload: '{ \"Key1\" : \"Value1\" }'\n";
  }
  return output;
}