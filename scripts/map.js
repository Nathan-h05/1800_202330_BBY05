function showMap() {
  //getLocation();
  //-----------------------------------------
  // Define and initialize basic mapbox data
  //-----------------------------------------
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
  const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
    // center: [-122.9927971, 49.2505439], // Starting position
    zoom: 12 // Starting zoom
  });

  // Add user controls to map
  map.addControl(new mapboxgl.NavigationControl());

  navigator.geolocation.getCurrentPosition(
    position => {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      
      // Update the map's center with the user's location
      map.setCenter(userLocation);
  //------------------------------------
  // Listen for when map finishes loading
  // then Add map features 
  //------------------------------------
  map.on('load', () => {

    // Defines map pin icon for events
    map.loadImage(
      'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('eventpin', image); // Pin Icon

        // READING information from "hikes" collection in Firestore
        db.collection('posts').get().then((querySnapshot) => {
          const features = []; // Defines an empty array for information to be added to

          querySnapshot.forEach(doc => {
            lat = doc.data().lat;
            lng = doc.data().lng;
            console.log(lat, lng);
            coordinates = [lng, lat];
            console.log(coordinates);
            // Coordinates
            event_name = doc.data().name; // Event Name
            preview = doc.data().details; // Text Preview

            features.push({
              'type': 'Feature',
              'properties': {
                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> <a href="/viewPosts.html?id=${doc.id}" title="Opens in a new window">View Post</a>`
              },
              'geometry': {
                'type': 'Point',
                'coordinates': coordinates
              }
            });
          });

          // Adds features as a source of data for the map
          map.addSource('posts', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          });

          // Creates a layer above the map displaying the pins
          // by using the sources that was just added
          map.addLayer({
            'id': 'posts',
            'type': 'symbol',
            // source: 'places',
            'source': 'posts',
            'layout': {
              'icon-image': 'eventpin', // Pin Icon
              'icon-size': 0.1, // Pin Size
              'icon-allow-overlap': true // Allows icons to overlap
            }
          });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
          //-----------------------------------------------------------------------
          // Add Click event listener, and handler function that creates a popup
          // that displays info from "posts" collection in Firestore
          //-----------------------------------------------------------------------
          map.on('click', 'posts', (e) => {
            // Extract coordinates array.
            // Extract description of that place
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });

          //-----------------------------------------------------------------------
          // Add mousenter event listener, and handler function to 
          // Change the cursor to a pointer when the mouse is over the places layer.
          //-----------------------------------------------------------------------
          map.on('mouseenter', 'posts', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          // Defaults cursor when not hovering over the places layer
          map.on('mouseleave', 'posts', () => {
            map.getCanvas().style.cursor = '';
          });
        });
      }
    );

    // Add the image to the map style.
    map.loadImage(
      'images/myLocation.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style with width and height values
        map.addImage('userpin', image, { width: 15, height: 15 });

        // Adds user's current location as a source to the map
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          console.log(userLocation);
          if (userLocation) {
            map.addSource('userLocation', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [{
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': userLocation
                  },
                  'properties': {
                    'description': 'Your location'
                  }
                }]
              }
            });

            // Creates a layer above the map displaying the user's location
            map.addLayer({
              'id': 'userLocation',
              'type': 'symbol',
              'source': 'userLocation',
              'layout': {
                'icon-image': 'userpin', // Pin Icon
                'icon-size': 0.05, // Pin Size
                'icon-allow-overlap': true // Allows icons to overlap
              }
            });

            // Map On Click function that creates a popup displaying the user's location
            map.on('click', 'userLocation', (e) => {
              // Copy coordinates array.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the userLocation layer.
            map.on('mouseenter', 'userLocation', () => {
              map.getCanvas().style.cursor = 'pointer';
            });

            
            // Defaults cursor when not hovering over the userLocation layer
            map.on('mouseleave', 'userLocation', () => {
              map.getCanvas().style.cursor = '';
            });
          }
        });
      }
    );
  });
}

// Call the function to display the map with the user's location and event pins
showMap();

function addPostPins(map) {

  // READING information from collection in Firestore
  db.collection('posts').get()
    .then(allEvents => {
      const features = []; // Defines an empty array for information to be added to
      allEvents.forEach(doc => {
        // Extract corordinate pair of this plce
        coordinates = [doc.data().lng, doc.data().lat];
        // Extract any needed info from the document
        name = doc.data().name
        desc = doc.data().description

        // Pushes information into the features array
        
        features.push({
          'type': 'Feature',
          'properties': {
            id: doc.id,  //store the id with each place
            description:
              
              `<h5> ${name}</h5> <p> ${desc} </p>`
          },
          'geometry': {
            'type': 'Point',
            'coordinates': coordinates
          }
        });
      });

      // Add the features array as a data source
      map.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        }
      })

      // Add a layer showing this new data source of places
      map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
          'circle-color': '#4264fb',
          'circle-radius': 222,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      //-----------------------------------
      // If someone clicks on a places pin
      // then show more info on that place
      //-----------------------------------
      map.on('click', 'places', (e) => {
      
        const id = e.features[0].properties.id;  //get the "id" field
        
        // re-direct to another page that gives more details about this post (by id)
        window.location.href = './viewPosts.html?docID=' + id;
      });

      //--------------------------------------------------
      // Create a popup, but don't add it to the map yet.
      //--------------------------------------------------
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      //-------------------------------------------------
      // Detect for "hover" by listening to mouse-enter
      //-------------------------------------------------
      map.on('mouseenter', 'places', (e) => {
        console.log("mouse entered!");

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Extract info of the place that was clicked, coords, and description
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // showing the description info, add to map
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      // Once the user un-hovers, clear the cursor, remove popup
      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

}