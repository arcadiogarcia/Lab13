//Variable global guarra para el compañero
var partner = "";


WinJS.Application.onready = function () {
    //Contact picker o textbox dependiendo de si esta en una web o no
    if (typeof Windows != 'undefined') {
        document.getElementById("altName").style.display = "none";
        document.getElementById("altEmail").style.display = "none";
    } else {
        document.getElementById("pickSomeone").style.display = "none";
    }


    // Create a JavaScript date object for date September 1, 1990.
    // Note, JavaScript months are 0 based so September is referenced by 8, not 9
    var initialDate = new Date(2015, 29, 8, 12, 0, 0, 0);
    var currentDate = new Date();
    var divControlTime = document.querySelector("#divControlTime");
    var divControlDate = document.querySelector("#divControlDate");
    // Create a new TimePicker control with value of initialDate inside element "myTimePickerDiv"
    var controlTime = new WinJS.UI.TimePicker(divControlTime, { current: initialDate });

    // Create a new DatePicker control with value of initialDate inside element "myDatePickerDiv"
    var controlDate = new WinJS.UI.DatePicker(divControlDate, { current: currentDate });
    document.querySelector("#pickSomeone").addEventListener("click", pickContact, false);

    WinJS.UI.processAll();

    //Esta desplegado el dialogo de send?
    var sending = false;

    document.querySelector("#send").addEventListener("click", function () {
        console.log(sending);
        if (sending) {
            clickback();
        } else {
            clicksend();
        }
    });

    function clicksend() {
        document.querySelector("#sendbox").style.height = window.innerHeight + "px";
        document.querySelector("#send").innerHTML = "Atras";

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

        button.addEventListener("click", function (e) {
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
                    .done(function (appointmentId) {
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

        button.addEventListener("click", function (e) {
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
        document.querySelector("#send").innerHTML = "Enviar";

        document.querySelector("#sendactions").innerHTML = "";

        sending = false;

    }
};

//Cortana!
//Leer https://gist.github.com/seksenov/17032e9a6eb9c17f88b5
 if (typeof Windows !== 'undefined' && 
    typeof Windows.UI !== 'undefined' && 
    typeof Windows.ApplicationModel !== 'undefined') { 

Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function (args) {
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
        picker.pickContactAsync().done(function (contact) {
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