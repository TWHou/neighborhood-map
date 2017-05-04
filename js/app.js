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
    this.visible = ko.observable(true);
    this.marker = new google.maps.Marker({
        map: map,
        title: data.name,
        position: data.geometry.location,
        /*icon: {
            url: data.icon,
            size: new google.maps.Size(35,35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 15),
            scaledSize: new google.maps.Size(25, 25)
        },*/
        animation: google.maps.Animation.DROP
    });
}

let ViewModel = function() {
    let self = this;

    this.museums = ko.observableArray();
    placeIds.forEach(function(placeId) {
        let service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: placeId
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                self.museums.push(new Museum(place));
            } else {
                console.log(status);
            }
        });
    });
    this.filter = ko.observable("");
    this.filteredMuseums = ko.computed(function() {
        let filter = self.filter().toLowerCase();
        if (!filter) {
            return self.museums();
        }
    });

    this.showModal = ko.observable(false);
    this.currentMuseum = ko.observable(this.museums()[0]);
}

let map;

var initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:40.7881576, lng:-73.9635527},
        zoom: 15
    });
    ko.applyBindings(new ViewModel());
}