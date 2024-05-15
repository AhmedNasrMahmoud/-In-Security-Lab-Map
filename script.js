mapboxgl.accessToken = config.accessToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: [0, 20],
    zoom: 2
});

let currentStoryIndex = 0; // Initialize the story index
const storyPoints = [
    {
        center: [14.037918743922944, 51.2],
        zoom: 5.5,
        narrative: `<h2>Crime Data Overview</h2><p>Explore crime data across regions.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        showNewTileset: true
    },
    {
        center: [14.037918743922944, 51.2],
        zoom: 5.8,
        narrative: `<h2>Points of Interest Data Overview</h2><p>Explore Points of Interest data across regions.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        showNewTileset: true
    },
    {
        center: [10.5, 51.5],
        zoom: 5.6,
        narrative: `<h2>Trial Data Overview</h2><p>Explore Trial data across regions.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        showNewTileset: true
    },
    {
        center: [10.5, 51.5],
        zoom: 5.6,
        narrative: `<h2>Trial Data Overview</h2><p>Explore Trial data across regions.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
    },
];

function showStoryPoint(index) {
    const point = storyPoints[index];
    if (!point) return; // Exit if the index is out of bounds

    // Close any existing popups
    if (window.currentPopup) {
        window.currentPopup.remove();
        window.currentPopup = null;
    }

    map.flyTo({
        center: point.center,
        zoom: point.zoom
    });

    document.getElementById('narrative').innerHTML = point.narrative +
        `<div id="story-controls">
            <button onclick="navigateStory(-1)">Previous</button>
            <button onclick="navigateStory(1)">Next</button>
        </div>`;

    // Handle layer visibility
    if (index === 0) { // For the first story point
        if (map.getLayer('pointsOfInterest')) map.setLayoutProperty('pointsOfInterest', 'visibility', 'none');
        if (map.getLayer('trials')) map.setLayoutProperty('trials', 'visibility', 'none');
        if (map.getLayer('poi-labels')) map.setLayoutProperty('poi-labels', 'visibility', 'none');
        if (map.getLayer('trials-labels')) map.setLayoutProperty('trials-labels', 'visibility', 'none');
        map.setLayoutProperty('crimes', 'visibility', 'visible');
    } else if (index === 1) { // For the second story point
        if (map.getLayer('crimes')) map.setLayoutProperty('crimes', 'visibility', 'none');
        if (map.getLayer('trials')) map.setLayoutProperty('trials', 'visibility', 'none');
        if (map.getLayer('trials-labels')) map.setLayoutProperty('trials-labels', 'visibility', 'none');
        map.setLayoutProperty('pointsOfInterest', 'visibility', 'visible');
        map.setLayoutProperty('poi-labels', 'visibility', 'visible');
    } else if (index === 2) { // For the third story point
        if (map.getLayer('crimes')) map.setLayoutProperty('crimes', 'visibility', 'none');
        if (map.getLayer('pointsOfInterest')) map.setLayoutProperty('pointsOfInterest', 'visibility', 'none');
        if (map.getLayer('poi-labels')) map.setLayoutProperty('poi-labels', 'visibility', 'none');
        map.setLayoutProperty('trials', 'visibility', 'visible');
        map.setLayoutProperty('trials-labels', 'visibility', 'visible');
    }
    else if (index > 2) { // For the third story point
        if (map.getLayer('crimes')) map.setLayoutProperty('crimes', 'visibility', 'none');
        if (map.getLayer('pointsOfInterest')) map.setLayoutProperty('pointsOfInterest', 'visibility', 'none');
        if (map.getLayer('poi-labels')) map.setLayoutProperty('poi-labels', 'visibility', 'none');
        map.setLayoutProperty('trials', 'visibility', 'visible');
        map.setLayoutProperty('trials-labels', 'visibility', 'visible');
    }

    // Assuming the side panel HTML is already in place as described previously
    map.on('click', 'crimes', (e) => {
        document.getElementById('point-list').innerHTML = '';

        var bbox = [[e.point.x - 5, e.point.y - 1], [e.point.x + 5, e.point.y + 1]]; // Adjust radius as needed
        var features = map.queryRenderedFeatures(bbox, { layers: ['crimes'] });

        if (features.length) {
            document.getElementById('side-panel').style.display = 'block';
            var listHTML = '';
            features.forEach(function (feature, index) {
                const defendantName = feature.properties['Defendant Name'];
                listHTML += `<div class="list-item" data-index="${index}">${defendantName}</div>`;
            });
            document.getElementById('point-list').innerHTML = listHTML;
            if (window.currentPopup) {
                window.currentPopup.remove(); // Close the current popup if it exists
            }
            // Add click listeners to each list item
            document.querySelectorAll('.list-item').forEach(function (item) {
                item.addEventListener('click', function () {
                    if (window.currentPopup) {
                        window.currentPopup.remove();
                    }

                    var index = this.getAttribute('data-index');
                    var feature = features[index];

                    let popupContent = `<h3>Defendant Name: ${feature.properties['Defendant Name']}</h3>`;
                    const preferredOrder = ['Gender/Sex', 'Crime', '﻿ID'];

                    const keys = Object.keys(feature.properties)
                        .filter(key => !['GeoLocation of Trial', 'GeoLocation of Crime', 'Territory', 'Defendant Name', 'Latitude', 'Longitude', 'Lat', 'Long', 'Lng']
                            .includes(key) && feature.properties[key] !== '.' && feature.properties[key] !== '');

                    const sortedKeys = [...preferredOrder, ...keys.filter(key => !preferredOrder.includes(key))];

                    for (const key of sortedKeys) {
                        let displayKey = key;
                        let displayValue = feature.properties[key];
                        if (key === "Gender/Sex") {
                            displayValue = (displayValue === '0' || displayValue === 0) ? 'Male' : 'Female';
                        } else if (displayValue === '0' || displayValue === 0) {
                            displayValue = 'No';
                        } else if (displayValue === '1' || displayValue === 1) {
                            displayValue = 'Yes';
                        } else if (key === "Nationality 1" || key === "Nationality 2") {
                            displayKey = "Nationality of Victim";
                        } else if (key === "Victim 1" || key === "Victim 2") {
                            displayKey = "Type of Victim";
                        }

                        popupContent += `<div><strong>${displayKey}</strong>: ${displayValue}</div>`;
                    }

                    window.currentPopup = new mapboxgl.Popup()
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML(popupContent)
                        .addTo(map);
                });
            });
        } else {
            document.getElementById('side-panel').style.display = 'none';
        }
    });

    map.on('click', 'pointsOfInterest', (e) => {
        const Name = e.features[0].properties['Name of Location'];
        let popupContent = `<h3>Name of Location: ${Name}</h3>`;
        for (const [key, value] of Object.entries(e.features[0].properties)) {
            if (value !== '.' && value !== '' && key !== 'Name of Location') {
                let displayKey = key;
                if (key === "Nationality 1" || key === "Nationality 2") {
                    displayKey = "Nationality of Victim";
                } else if (key === "Victim 1" || key === "Victim 2") {
                    displayKey = "Type of Victim";
                }
                popupContent += `<div><strong>${displayKey}</strong>: ${value}</div>`;
            }
        }
        if (window.currentPopup) {
            window.currentPopup.remove();
        }
        window.currentPopup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map);
    });

    map.on('click', 'trials', (e) => {
        document.getElementById('point-list').innerHTML = '';

        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
        var features = map.queryRenderedFeatures(bbox, { layers: ['trials'] });

        if (features.length) {
            document.getElementById('side-panel').style.display = 'block';
            var listHTML = '';
            features.forEach(function (feature, index) {
                const trialNumber = `<p>Trial Number: ${feature.properties['Trial No.']}</p>`;
                listHTML += `<div class="list-item" data-index="${index}">${trialNumber}</div>`;
            });
            document.getElementById('point-list').innerHTML = listHTML;

            document.querySelectorAll('.list-item').forEach(function (item) {
                item.addEventListener('click', function () {
                    if (window.currentPopup) {
                        window.currentPopup.remove(); // Close the current popup if it exists
                    }

                    var index = this.getAttribute('data-index');
                    var feature = features[index];

                    let popupContent = `<h3>Trial Number: ${feature.properties['Trial No.']}</h3>`;
                    const preferredOrder = ['Defendant Name', 'Gender/Sex', 'Crime'];

                    const keys = Object.keys(feature.properties)
                        .filter(key => !['Trial No.', 'GeoLocation of Trial', 'GeoLocation of Crime', 'Territory', 'Latitude', 'Longitude', 'Lat', 'Long', 'Lng']
                            .includes(key) && feature.properties[key] !== '.' && feature.properties[key] !== '');

                    const sortedKeys = [...preferredOrder, ...keys.filter(key => !preferredOrder.includes(key))];
                    for (const key of sortedKeys) {
                        let displayKey = key;
                        let displayValue = feature.properties[key];
                        if (key === "Gender/Sex") {
                            displayValue = (displayValue === '0' || displayValue === 0) ? 'Male' : 'Female';
                        } else if (displayValue === '0' || displayValue === 0) {
                            displayValue = 'No';
                        } else if (displayValue === '1' || displayValue === 1) {
                            displayValue = 'Yes';
                        } else if (key === "Nationality 1" || key === "Nationality 2") {
                            displayKey = "Nationality of Victim";
                        } else if (key === "Victim 1" || key === "Victim 2") {
                            displayKey = "Type of Victim";
                        }

                        popupContent += `<div><strong>${displayKey}</strong>: ${displayValue}</div>`;
                    }

                    window.currentPopup = new mapboxgl.Popup()
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML(popupContent)
                        .addTo(map);
                });
            });
        } else {
            document.getElementById('side-panel').style.display = 'none';
        }
    });

    const layers = ['crimes', 'pointsOfInterest', 'trials'];
    layers.forEach(layer => {
        map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', layer, () => map.getCanvas().style.cursor = '');
    });
}

function navigateStory(direction) {
    const newIndex = currentStoryIndex + direction;
    if (newIndex >= 0 && newIndex < storyPoints.length) {
        // Close any existing popups
        if (window.currentPopup) {
            window.currentPopup.remove();
            window.currentPopup = null;
        }

        currentStoryIndex = newIndex;
        showStoryPoint(currentStoryIndex);
        // Manage panel visibility based on the currentStoryIndex
        document.getElementById('crime-panel').style.display = currentStoryIndex === 0 ? 'block' : 'none';
        document.getElementById('poi-panel').style.display = currentStoryIndex === 1 ? 'block' : 'none';
        document.getElementById('trial-panel').style.display = currentStoryIndex === 2 ? 'block' : 'none';
        document.getElementById('conclusion-panel').style.display = currentStoryIndex > 2 ? 'block' : 'none';
        document.getElementById('narrative').style.display = 'none';
        document.getElementById('side-panel').style.display = 'none';
    }
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('list-item-title')) {
        const detailsElement = event.target.nextElementSibling;
        detailsElement.classList.toggle('open'); // Toggle visibility of details
    }
});

map.on('load', () => {
    map.addSource('crimes', {
        'url': config.CrimesURL,
        'type': 'vector',
    });

    map.addLayer({
        'id': 'crimes',
        'type': 'circle',
        'source': 'crimes',
        'source-layer': config.CrimesSource,
        'paint': {
            'circle-color': [
                'match',
                ['get', 'Gender/Sex'], // Get the 'Gender/Sex' property of the feature
                0, '#7F3121', // Color for Male (assuming '0' is Male)
                1, '#FF69B4', // Color for Female (assuming '1' is Female)
                '#CCCCCC' // Default color if neither
            ],
            'circle-opacity': 0.75,
            'circle-radius': 5
        },
    });

    map.addSource('pointsOfInterest', {
        'url': config.InterestURL, // Ensure this URL is correctly set in your config.js
        'type': 'vector'
    });
    map.addLayer({
        'id': 'pointsOfInterest',
        'type': 'circle',
        'source': 'pointsOfInterest', // Make sure this matches the newly added source ID
        'source-layer': config.InterestSource, // This should match your actual source layer ID in the tileset
        'paint': {
            'circle-color': [
                'match',
                ['get', 'Category'], // Get the 'Category' property of the feature
                'Labor Camp', '#7F3121',
                'Hospital', '#FF69B4',
                'Medical Institution', '#0000FF',
                'Concentration Camp', '#FF0000',
                '#CCCCCC' // Default color if neither
            ],
            'circle-opacity': 0.75,
            'circle-radius': 5
        }
    });

    map.addLayer({
        'id': 'poi-labels',
        'type': 'symbol',
        'source': 'pointsOfInterest',
        'source-layer': config.InterestSource,
        'layout': {
            'text-field': ['get', 'Name of Location'],
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 0.5],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
        },
        'paint': {
            // Use the same 'match' expression for 'text-color' as used for 'circle-color' in 'pointsOfInterest'
            'text-color': [
                'match',
                ['get', 'Category'],
                'Labor Camp', '#7F3121',
                'Hospital', '#FF69B4',
                'Medical Institution', '#0000FF',
                'Concentration Camp', '#FF0000',
                '#CCCCCC' // Default color if the category doesn't match any of the specified
            ]
        }
    });

    map.addSource('trials', {
        'url': config.TrialsURL, // Ensure this URL is correctly set in your config.js
        'type': 'vector'
    });
    map.addLayer({
        'id': 'trials',
        'type': 'circle',
        'source': 'trials', // Make sure this matches the newly added source ID
        'source-layer': config.TrialsSource,
        'paint': {
            'circle-color': '#006400',
            'circle-opacity': 0.75,
            'circle-radius': 5
        }
    });

    map.addLayer({
        'id': 'trials-labels',
        'type': 'symbol',
        'source': 'trials',
        'source-layer': config.TrialsSource,
        'layout': {
            'text-field': ['get', 'Court Date'],
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 0.5],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
        },
        'paint': {
            'text-color': '#006400', // Set the text color
            'text-opacity': 0.75, // Set the text opacity for visibility
        }
    });
});
