//Variable global guarra para el compañero
var partner = "";


WinJS.Application.onready = function() {
    //Contact picker o textbox dependiendo de si esta en una web o no
    if (typeof Windows != 'undefined') {
        document.getElementById("altName").style.display = "none";
        document.getElementById("altEmail").style.display = "none";
    } else {
        document.getElementById("pickSomeone").style.display = "none";
    }



    var currentDate = new Date();
    var divControlTime = document.querySelector("#divControlTime");
    var divControlDate = document.querySelector("#divControlDate");
    // Create a new TimePicker control with value of initialDate inside element "myTimePickerDiv"
    var controlTime = new WinJS.UI.TimePicker(divControlTime, { current: currentDate });

    // Create a new DatePicker control with value of initialDate inside element "myDatePickerDiv"
    var controlDate = new WinJS.UI.DatePicker(divControlDate, { current: currentDate });
    document.querySelector("#pickSomeone").addEventListener("click", pickContact, false);

    WinJS.UI.processAll();

    //Esta desplegado el dialogo de send?
    var sending = false;

    document.querySelector("#send").addEventListener("click", function() {
        console.log(sending);
        if (sending) {
            clickback();
        } else {
            clicksend();
        }
    });

    document.querySelector("#findLab").addEventListener("click", function() {
        console.log(sending);
        if (sending) {
            clickback();
        } else {
            clickfind();
        }
    });


    function clickfind() {
        document.querySelector("#sendbox").style.height = window.innerHeight + "px";
        document.querySelector("#findLab").innerHTML = "Atras";
        document.querySelector("#send").style.visibility = "hidden";

        var date = document.getElementById("divControlDate").winControl.current;
        var time = document.getElementById("divControlTime").winControl.current;
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/API/lab/' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '/');
        xhr.onreadystatechange = function() {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    var currentTimeSlot = time.getHours() + ":00-" + (time.getHours() + 1) + ":00";
                    var reply = JSON.parse(xhr.responseText);
                    // currentTimeSlot = "10:00-11:00" // For testing
                    var freeLabs = [];
                    for (var key in reply) {
                        var count = 0;
                        reply[key].forEach(function(x) {
                            if (count > 0 || x.title.indexOf(currentTimeSlot) == 0) {
                                if (x.available) {
                                    count++;
                                } else {
                                    if (count > 0) {
                                        freeLabs.push({ lab: key, freeHours: count });
                                    }
                                    count = NaN;
                                }
                            }
                        });
                        if (count > 0) {
                            freeLabs.push({ lab: key, freeHours: count });
                        }
                    }
                    freeLabs.sort(function(x, y) { return y.freeHours - x.freeHours; }).forEach(createLabOption);
                    if (freeLabs.length == 0) {
                        button = document.createElement("button");
                        button.className = "appearbutton win-button action";

                        button.style.width = "80%";
                        button.style.height = "40%";
                        button.style.display = "block";
                        button.style.margin = "10%";
                        button.style["text-align"] = "center";
                        button.style["margin-top"] = "10px";
                        button.style["margin-bottom"] = "10px";
                        button.innerHTML = "No hay laboratorios libres a la hora indicada.";

                        document.querySelector("#sendactions").appendChild(button);

                        button.addEventListener("click", function() {
                            clickback();
                        });
                    }
                } else {
                    alert('Error: ' + xhr.status); // An error occurred during the request.
                }
            }
        };
        xhr.send(null);
            

        function createLabOption(option) {
            button = document.createElement("button");
            button.className = "appearbutton win-button action";

            button.style.width = "80%";
            button.style.height = "40%";
            button.style.display = "block";
            button.style.margin = "10%";
            button.style["text-align"] = "left";
            button.style["margin-top"] = "10px";
            button.style["margin-bottom"] = "10px";
            button.innerHTML = "<h3 style='display:inline;margin-left:10%;'>" + option.lab + "</h3><div style='display:inline-block;float:right;margin-right:10%;'> Disponible " + option.freeHours + " horas, hasta las " + (time.getHours() + option.freeHours) + ":00</div>";

            document.querySelector("#sendactions").appendChild(button);

            button.addEventListener("click", function() {
                document.querySelector("#placebox").value = option.lab;
                clickback();
            });
        }
        sending = true;
    };

    function clicksend() {
        document.querySelector("#sendbox").style.height = window.innerHeight + "px";
        document.querySelector("#findLab").innerHTML = "Atras";
        document.querySelector("#send").style.visibility = "hidden";

        button = document.createElement("button");
        button.className = "appearbutton win-button action";
        button.id = "pinStart";
        button.innerHTML = "Anclar a Inicio";
        button.style.width = "80%";
        button.style.height = "40%";
        button.style.display = "block";
        button.style.margin = "10%";
        button.style["margin-top"] = "50px";
        button.style["margin-bottom"] = "10px";
        document.querySelector("#sendactions").appendChild(button);

        button.addEventListener("click", pinLiveTile);



        var button = document.createElement("button");
        button.className = "appearbutton win-button action";
        button.id = "addCalendar";
        button.innerHTML = "Añadir al calendario";
        button.style.width = "80%";
        button.style.height = "40%";
        button.style.display = "block";
        button.style.margin = "10%";
        button.style["margin-top"] = "50px";
        button.style["margin-bottom"] = "10px";
        document.querySelector("#sendactions").appendChild(button);

        button.addEventListener("click", function(e) {
            if (typeof Windows != 'undefined') {
                // Create an Appointment that should be added the user's appointments provider app.
                var appointment = new Windows.ApplicationModel.Appointments.Appointment();
                appointment.subject = "Practica de " + document.querySelector("#subjectbox").value + " con " + partner.displayName;
                appointment.details = "Creado automáticamente por la app Lab13";
                appointment.location = document.querySelector("#placebox").value;
                var date = document.getElementById("divControlDate").winControl.current;
                var time = document.getElementById("divControlTime").winControl.current;
                appointment.startTime = date;
                appointment.startTime.setMinutes(time.getMinutes());
                appointment.startTime.setHours(time.getHours());
                // Get the selection rect of the button pressed to add this appointment
                var boundingRect = e.srcElement.getBoundingClientRect();
                var selectionRect = { x: boundingRect.left, y: boundingRect.top, width: boundingRect.width, height: boundingRect.height };
                // ShowAddAppointmentAsync returns an appointment id if the appointment given was added to the user's calendar.
                // This value should be stored in app data and roamed so that the appointment can be replaced or removed in the future.
                // An empty string return value indicates that the user canceled the operation before the appointment was added.
                Windows.ApplicationModel.Appointments.AppointmentManager.showAddAppointmentAsync(appointment, selectionRect, Windows.UI.Popups.Placement.default)
                    .done(function(appointmentId) {
                        if (appointmentId) {
                            document.querySelector("#addCalendar").innerHTML = "Añadido a tu calendario!";
                            document.querySelector("#addCalendar").style.background = "#3F3";
                        } else {
                            document.querySelector("#addCalendar").innerHTML = "Error añadiendo al calendario!";
                            document.querySelector("#addCalendar").style.background = "#F00";
                        }
                    });
            } else {
                window.alert("This functionality is only available in the Windows 10 app.")
            }
        });


        button = document.createElement("button");
        button.className = "appearbutton win-button action";
        button.id = "sendMail";
        button.innerHTML = "Enviar email";
        button.style.width = "80%";
        button.style.height = "40%";
        button.style.display = "block";
        button.style.margin = "10%";
        button.style["margin-top"] = "50px";
        button.style["margin-bottom"] = "10px";
        document.querySelector("#sendactions").appendChild(button);

        button.addEventListener("click", function(e) {
            if (typeof Windows != 'undefined') {
                //Nothing to do
            } else {
                partner = { emails: [{ address: document.getElementById("altEmail").value }], displayName: document.getElementById("altName").value };
            }
            if (partner.emails && partner.emails.length > 0) {
                var date = document.getElementById("divControlDate").winControl.current;
                var time = document.getElementById("divControlTime").winControl.current;
                var subject = document.querySelector("#subjectbox").value;
                var place = document.querySelector("#placebox").value;
                var mailto = "mailto:" + partner.emails[0].address + "?subject=Practica%20de%20" + subject + "&body=";
                mailto += "Hola%20" + partner.displayName + ",%0A%0A";
                mailto += "¿Que%20te%20parece%20si%20quedamos%20el%20dia%20" + date.toLocaleDateString() + "%20a%20las%20" + time.toLocaleTimeString();
                mailto += "%20en%20" + place + "%20para%20hacer%20la%20practica%20de%20" + subject + "?";
                mailto += "%0A%0A%0AEmail%20generado%20automaticamente%20por%20Lab13";
                window.location = mailto;
            }
        });

        sending = true;
    }

    function clickback() {
        document.querySelector("#sendbox").style.height = "50px";
        document.querySelector("#findLab").innerHTML = "Encontrar laboratorios libres";

        document.querySelector("#sendactions").innerHTML = "";

        document.querySelector("#send").style.visibility = "visible";

        sending = false;

    }
};

//Cortana!
//Leer https://gist.github.com/seksenov/17032e9a6eb9c17f88b5
if (typeof Windows !== 'undefined' &&
    typeof Windows.UI !== 'undefined' &&
    typeof Windows.ApplicationModel !== 'undefined') {

    Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function(args) {
        var activation = Windows.ApplicationModel.Activation;
        // Check to see if the app was activated by a voice command 
        if (args.kind === activation.ActivationKind.voiceCommand) {

            // When directly launched via VCD, activation is via the VoiceCommand ActivationKind.
            // Using the "
            var speechRecognitionResult = args.result;
            var voiceCommandName = speechRecognitionResult.rulePath[0];
            switch (voiceCommandName) {
                case "nuevaPractica":
                    var asignatura = speechRecognitionResult.semanticInterpretation.properties["asignatura"][0];
                    var lugar = speechRecognitionResult.semanticInterpretation.properties["lugar"][0];
                    document.getElementById("subjectbox").value = asignatura;
                    document.getElementById("placebox").value = lugar;
                    break;
                default:
                    break;
            }
        }
    });
}



function pickContact() {
    if (typeof Windows != 'undefined') {
        // Create the picker 
        var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
        picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
        // Open the picker for the user to select a contact 
        picker.pickContactAsync().done(function(contact) {
            if (contact !== null) {
                partner = contact;
                document.querySelector("#pickSomeone").innerText = contact.displayName;
            } else {
                return "No one";
            }
        });
    }
}


//Color de la titlebar
if (typeof Windows !== 'undefined' && typeof Windows.UI !== 'undefined' && typeof Windows.UI.ViewManagement !== 'undefined') {
    // Get a reference to the App Title Bar 
    Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title = "";
    Windows.UI.ViewManagement.ApplicationViewTitleBar.ExtendViewIntoTitleBar = true;
    var appTitleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;

    appTitleBar.foregroundColor = { r: 255, g: 255, b: 255, a: 0 };
    appTitleBar.backgroundColor = { r: 68, g: 153, b: 221, a: 0 };
    appTitleBar.buttonBackgroundColor = { r: 68, g: 153, b: 221, a: 0 };
}


function pinLiveTile() {
    if (typeof Windows !== 'undefined') {
        var notifications = Windows.UI.Notifications;

        var template = notifications.TileTemplateType.tileWide310x150BlockAndText02;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

        var date = document.getElementById("divControlDate").winControl.current;
        var time = document.getElementById("divControlTime").winControl.current;
        var subject = document.querySelector("#subjectbox").value;
        var place = document.querySelector("#placebox").value;
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode("Práctica de " + subject + " con " + partner.displayName + " a las " + time.toLocaleTimeString() + " en " + place));
        tileTextAttributes[1].appendChild(tileXml.createTextNode(date.getUTCDate()));
        tileTextAttributes[2].appendChild(tileXml.createTextNode(monthNames[date.getMonth()]));

        var tileNotification = new notifications.TileNotification(tileXml);

        tileNotification.expirationTime = new Date(date.getTime() + 3600 * 24);

        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

        document.querySelector("#pinStart").innerHTML = "Añadido a la Live Tile!";
        document.querySelector("#pinStart").style.background = "#3F3";
    }
}

WinJS.Application.start();