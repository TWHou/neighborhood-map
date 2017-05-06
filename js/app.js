let placeIds = [
    "ChIJNXfoO9ZewokRokcDxcgROwo",
    "ChIJWT0gUBz2wokRNcAxVUphAAs",
    "ChIJi4hYtB32wokR1Npx_Tv7phk",
    "ChIJxY5cO6JYwokRPeVk85UNj2g",
    "ChIJsT8qSaJYwokR-m20OGJUKCA",
    "ChIJISGWiaJYwokRuOumpQv1i88",
    "ChIJmZ5emqJYwokRuDz79o0coAQ",
    "ChIJ01_9-ZdYwokRL2JrA28GJp8",
    "ChIJb8Jg9pZYwokR-qHGtvSkLzs"
];

let Museum = function (data) {
    this.placeId = data.place_id;
    this.name = data.name;
    this.address = data.formatted_address;
    this.hours = data.opening_hours ? data.opening_hours.weekday_text : "";
    this.url = data.website;
    this.wikiText = "";
    this.wikiUrl = "";
    this.marker = new google.maps.Marker({
        map: map,
        title: data.name,
        position: data.geometry.location,
        animation: google.maps.Animation.DROP
    });
}

let ViewModel = function() {
    let innerHTML = '<div id="info-window" data-bind="template: { name: \'info-template\', data: currentMuseum }"></div>';
    this.infowindow = new google.maps.InfoWindow({
        content: innerHTML
    });
    let infowindowLoaded = false;
    google.maps.event.addListener(this.infowindow, 'domready', () => {
        if (!infowindowLoaded) {
            ko.applyBindings(this, $('#info-window')[0]);
            infowindowLoaded = true;
        }
    });

    this.museums = ko.observableArray();
    this.currentMuseum = ko.observable(this.museums()[0]);

    placeIds.forEach(placeId => {
        let service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: placeId
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                let newMuseum = new Museum(place);
                $.ajax({
                    url: "https://en.wikipedia.org/w/api.php?",
                    data: {
                        "action": "opensearch",
                        "format": "json",
                        "search": newMuseum.name
                    },
                    dataType: "jsonp",
                    success: function(result) {
                        newMuseum.wikiText = result[2][0];
                        newMuseum.wikiUrl = result[3][0];
                    }
                });
                newMuseum.marker.addListener('click', () => {
                    this.handleClick(newMuseum);
                });
                this.museums.push(newMuseum);
            } else {
                console.log(status);
            }
        });
    });

    this.handleClick = museum => {
        this.currentMuseum(museum);
        this.openInfo(museum.marker, this.infowindow);
        this.animate(museum.marker);
    }

    this.openInfo = (marker, infowindow) => {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', () => {
                infowindow.marker = null;
            });
        }
    }

    this.animate = marker => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {marker.setAnimation(null)}, 1500);
    }

    this.filter = ko.observable("");
    this.filteredMuseums = ko.computed(() => {
        let filter = this.filter().toLowerCase();
        if (!filter) {
            this.museums().forEach(museum => {
                museum.marker.setVisible(true);
            });
            return this.museums();
        } else {
            return this.museums().filter(museum => {
                let result = museum.name.toLowerCase().indexOf(filter) >= 0;
                museum.marker.setVisible(result);
                return result;
            });
        }
    });
    this.toggleModal = () => {
        this.showModal(!this.showModal());
        $('body').toggleClass('modal-open');
    }
    this.showModal = ko.observable(false);
}

let map;

let initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:40.7881576, lng:-73.9635527},
        zoom: 15
    });
    ko.applyBindings(new ViewModel());
}

$.getScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAyWELkBZOJwFHDXT0uv7Xatiw0becAYac&v=3")
.done(initApp)
.fail(()=>{
    $('body').addClass('modal-open');
    $('.modal-content').html("<h2>Google Maps API failed.</h2><p>We could not make contact with Google. There will be no map for now.</p>")
});




