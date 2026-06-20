import {
    Client
} from "./archipelago.js";

export const ArchipelagoClient = {
    connectionInfo : null,
    client : null,
    apstatus : null,

    initialize() {
        this.login();
    },

    login() {
        // Create a new Archipelago this.client
        var hostport1 = "multiworld.gg:12345";
        // can this not be the replace function?
        if (hostport1.includes(";")) {
            var partAfter_semi = hostport1.split(";");
            hostport1 = partAfter_semi[0] + ":" + hakurei(partAfter_semi[1]);
        }

        this.connectionInfo = {
            hostport: hostport1, // Default hostpost
            game: "A Hat in Time", // Replace with the game name for this player.
            name: "AHatInToby",
            password: "",
            items_handling: 0b111,
        };
        console.log(this.connectionInfo);
        // Connect to the Archipelago server
        this.connectToServer();
    },

    /*login() {
        // Create a new Archipelago this.client
        var hostport1 = localStorage.getItem("hostport") || "archipelago.gg:38281";
        if (hostport1.includes(";")) {
            var partAfter_semi = hostport1.split(";");
            hostport1 = partAfter_semi[0] + ":" + hakurei(partAfter_semi[1]);
        }
        connectionInfo = {
            hostport: hostport1, // Default hostpost
            game: "AntimatterDimensions", // Replace with the game name for this player.
            name: localStorage.getItem("name") || "Player1", // Default player name
            password: document.getElementById("password").value,
            items_handling: 0b111,
        };

        document.getElementById('loginbutton').value  = "Connecting...";
        document.getElementById('loginbutton').style.backgroundColor = "orange";

        // Connect to the Archipelago server
        connectToServer();
    },*/

    connectToServer(firsttime = true) {
        this.client = new Client();
        this.client.items.on("itemsReceived", receiveditemsListener);
        this.client.socket.on("connected", connectedListener);
        this.client.socket.on("disconnected", disconnectedListener);
        this.client.socket.on("bounced", bouncedListener);
        
        this.client.messages.on("message", jsonListener);
        this.client.deathLink.on("deathReceived", deathListener);
        
        this.client
            .login(this.connectionInfo.hostport, this.connectionInfo.name, this.connectionInfo.game, {password: this.connectionInfo.password, tags: ["DeathLink"]})
                .then(() => {
                    console.log("Connected to the server");
                    //document.getElementById('loginbutton').value = "Connected to the server";
                })
                .catch((error) => {
                    console.log("Failed to connect", error)
                    let errorMessage = "Failed: " + error;

                    //document.getElementById('error-label').innerText = errorMessage + "\n Common remedies: refresh room and check login info.";
                    
                    //document.getElementById('loginbutton').style.backgroundColor = "#4caf50";
                    //document.getElementById('loginbutton').value = "Login & Connect again";
                });

    },

    
}

const receiveditemsListener = (items, index) => {
    console.log("ReceivedItems packet: ", items, index);
    newItems(items, index);
}

const connectedListener = (packet) => {
    ArchipelagoClient.apstatus ="AP: Connected";
};

const disconnectedListener = (packet) => {
    window.is_connected = false;
    ArchipelagoClient.apstatus = "AP: Disconnected. Progress saved, please refresh.";
    //document.getElementById("m6").innerText = apstatus;
    //menu.open();
};

const bouncedListener = (packet) => {
    console.log("Bounced packet:", packet);
    if(packet){
        if (packet.data) {
            console.log(packet.data);
            if (typeof packet.data[0] === "number") {
                window.move_piece_bounced(packet.data);
            }else{
                gotRandomNumber(packet.data[0], packet.data[1]);
            }
        }
    }
}

function jsonListener(text, nodes) {

    // display the text
}

function deathListener(source, time, cause){
    //wtf is deathlink gonna do (set every value to 1?)
}

var lastindex = 0;
function newItems(items, index) {
    setTimeout(() => {
        if (items && items.length) {
            if (index > lastindex) {
                alert("Something strange happened, you should have received more items already... Let's reconnect...");
                console.log("Expected index:", lastindex, "but got:", index, items);
            }
            var received_items = [];
            for (let i = lastindex - index; i < items.length; i++) {
                const item = items[i]; // Get the current item
                received_items.push([item.toString(), i, index]); // Add the item name to the 'items' array
            }
            openItems(received_items)
            lastindex = index + items.length;
        } else {
            console.log("No items received in this update...");
        }
    }, 300); // Wait for one second
}

//TODO: move to different script since itll be BIG
function openItems(items){
    console.log(items)
    for (let i = 0; i < items.length; i++) {
        let firstIndex = items[i][2];
        let indexItem = items[i][1];
        let item = items[i][0];
    }
}