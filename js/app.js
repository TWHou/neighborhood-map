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
    this.visible = ko.observable(true);
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
    let self = this;
    let innerHTML = '<div id="info-window" data-bind="template: { name: \'info-template\', data: currentMuseum }"></div>';
    this.infowindow = new google.maps.InfoWindow({
        content: innerHTML
    });
    let infowindowLoaded = false;
    google.maps.event.addListener(self.infowindow, 'domready', function(){
        if (!infowindowLoaded) {
            ko.applyBindings(self, $('#info-window')[0]);
            infowindowLoaded = true;
        }
    });

    this.museums = ko.observableArray();
    this.currentMuseum = ko.observable(this.museums()[0]);

    placeIds.forEach(function(placeId) {
        let service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: placeId
        }, function(place, status) {
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
                newMuseum.marker.addListener('click', function(){
                    self.handleClick(newMuseum);
                });
                self.museums.push(newMuseum);
            } else {
                console.log(status);
            }
        });
    });

    this.handleClick = function(museum) {
        self.currentMuseum(museum);
        self.openInfo(museum.marker, self.infowindow);
    }

    this.openInfo = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    }

    this.filter = ko.observable("");
    this.filteredMuseums = ko.computed(function() {
        let filter = self.filter().toLowerCase();
        if (!filter) {
            return self.museums();
        }
    });
    this.toggleModal = function() {
        self.showModal(!self.showModal());
        $('body').toggleClass('modal-open');
    }
    this.showModal = ko.observable(false);
}

let map;

var initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:40.7881576, lng:-73.9635527},
        zoom: 15
    });
    ko.applyBindings(new ViewModel());
}